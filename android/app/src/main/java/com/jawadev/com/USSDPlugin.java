package com.jawadev.com;

import android.Manifest;
import android.content.Context;
import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;
import android.telephony.TelephonyManager;
import android.telephony.TelephonyCallback;
import android.telephony.UssdResponse;
import android.os.Build;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@CapacitorPlugin(
    name = "USSD",
    permissions = {
        @Permission(strings = { Manifest.permission.CALL_PHONE }),
        @Permission(strings = { Manifest.permission.READ_PHONE_STATE }),
        @Permission(strings = { Manifest.permission.ACCESS_NETWORK_STATE })
    }
)
public class USSDPlugin extends Plugin {

    private TelephonyManager telephonyManager;
    private SubscriptionManager subscriptionManager;

    @Override
    public void load() {
        telephonyManager = (TelephonyManager) getContext().getSystemService(Context.TELEPHONY_SERVICE);
        subscriptionManager = SubscriptionManager.from(getContext());
    }

    @PluginMethod
    public void sendUSSDRequest(PluginCall call) {
        String code = call.getString("code");
        Integer simSlot = call.getInt("simSlot", 0);
        
        if (code == null) {
            call.reject("USSD code is required");
            return;
        }

        // Check permissions
        if (!hasRequiredPermissions()) {
            call.reject("Missing required permissions");
            return;
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                sendUSSDRequestAPI26Plus(call, code, simSlot);
            } else {
                sendUSSDRequestLegacy(call, code, simSlot);
            }
        } catch (Exception e) {
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }

    @PluginMethod
    public void getSIMInfo(PluginCall call) {
        Integer simSlot = call.getInt("simSlot", 0);
        
        try {
            JSObject result = new JSObject();
            
            if (hasRequiredPermissions()) {
                List<SubscriptionInfo> subscriptions = subscriptionManager.getActiveSubscriptionInfoList();
                
                if (subscriptions != null && !subscriptions.isEmpty()) {
                    SubscriptionInfo subInfo = null;
                    
                    // Find the subscription for the requested SIM slot
                    for (SubscriptionInfo info : subscriptions) {
                        if (info.getSimSlotIndex() == simSlot) {
                            subInfo = info;
                            break;
                        }
                    }
                    
                    if (subInfo == null && !subscriptions.isEmpty()) {
                        subInfo = subscriptions.get(0); // Fallback to first available
                    }
                    
                    if (subInfo != null) {
                        result.put("isActive", true);
                        result.put("carrier", subInfo.getCarrierName().toString());
                        result.put("phoneNumber", subInfo.getNumber());
                        result.put("simSlot", subInfo.getSimSlotIndex());
                    } else {
                        result.put("isActive", false);
                        result.put("simSlot", simSlot);
                    }
                } else {
                    result.put("isActive", false);
                    result.put("simSlot", simSlot);
                }
            } else {
                result.put("isActive", false);
                result.put("simSlot", simSlot);
            }
            
            call.resolve(result);
        } catch (Exception e) {
            JSObject result = new JSObject();
            result.put("isActive", false);
            result.put("simSlot", simSlot);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", hasRequiredPermissions());
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        requestPermissionForAliases(new String[]{"CALL_PHONE", "READ_PHONE_STATE"}, call, "permissionCallback");
    }

    private boolean hasRequiredPermissions() {
        return ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED &&
               ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
    }

    private void sendUSSDRequestAPI26Plus(PluginCall call, String code, Integer simSlot) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CountDownLatch latch = new CountDownLatch(1);
            final String[] response = new String[1];
            final boolean[] success = new boolean[1];
            final String[] error = new String[1];

            TelephonyCallback.UssdResponseCallback callback = new TelephonyCallback.UssdResponseCallback() {
                @Override
                public void onUssdResponse(TelephonyManager telephonyManager, String request, CharSequence responseText) {
                    response[0] = responseText.toString();
                    success[0] = true;
                    latch.countDown();
                }

                @Override
                public void onUssdFailure(TelephonyManager telephonyManager, String request, int failureCode) {
                    error[0] = "USSD failed with code: " + failureCode;
                    success[0] = false;
                    latch.countDown();
                }
            };

            try {
                telephonyManager.sendUssdRequest(code, callback, null);
                
                // Wait for response with timeout
                if (latch.await(30, TimeUnit.SECONDS)) {
                    JSObject result = new JSObject();
                    result.put("success", success[0]);
                    if (success[0]) {
                        result.put("result", response[0]);
                    } else {
                        result.put("error", error[0]);
                    }
                    call.resolve(result);
                } else {
                    JSObject result = new JSObject();
                    result.put("success", false);
                    result.put("error", "USSD request timeout");
                    call.resolve(result);
                }
            } catch (Exception e) {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("error", e.getMessage());
                call.resolve(result);
            }
        }
    }

    private void sendUSSDRequestLegacy(PluginCall call, String code, Integer simSlot) {
        // For older Android versions, we can't easily intercept USSD responses
        // This will open the native USSD dialog
        try {
            android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_CALL);
            intent.setData(android.net.Uri.parse("tel:" + android.net.Uri.encode(code)));
            
            if (intent.resolveActivity(getContext().getPackageManager()) != null) {
                getActivity().startActivity(intent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("result", "USSD request sent. Please check your phone's native USSD dialog.");
                call.resolve(result);
            } else {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("error", "No app can handle USSD requests");
                call.resolve(result);
            }
        } catch (Exception e) {
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }

    private void permissionCallback(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", hasRequiredPermissions());
        call.resolve(result);
    }
}