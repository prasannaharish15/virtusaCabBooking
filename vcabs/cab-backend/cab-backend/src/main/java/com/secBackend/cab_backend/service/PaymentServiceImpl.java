//package com.secBackend.cab_backend.service;
//
//import com.razorpay.Order;
//import com.razorpay.RazorpayClient;
//import com.secBackend.cab_backend.dataTansferObject.*;
//import com.secBackend.cab_backend.model.Payment;
//import com.secBackend.cab_backend.repository.PaymentRepository;
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//import java.util.Base64;
//
//@Service
//public class PaymentServiceImpl implements PaymentService {
//
//    @Value("${razorpay.key.id}")
//    private String razorpayKeyId;
//
//    @Value("${razorpay.key.secret}")
//    private String razorpayKeySecret;
//
//    private final PaymentRepository paymentRepository;
//
//    public PaymentServiceImpl(PaymentRepository paymentRepository) {
//        this.paymentRepository = paymentRepository;
//    }
//
//    @Override
//    public PaymentResponseDto createOrder(PaymentRequestDto request) {
//        try {
//            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
//
//            JSONObject orderRequest = new JSONObject();
//            int amountInPaise = (int) (request.getAmount() * 100);
//
//            orderRequest.put("amount", amountInPaise);
//            orderRequest.put("currency", "INR");
//            orderRequest.put("receipt", "rcpt_" + request.getRideId());
//
//            Order order = client.orders.create(orderRequest);
//
//            Payment payment = new Payment(
//                    request.getRideId(),
//                    request.getUserId(),
//                    request.getAmount(),
//                    "INR",
//                    order.get("id"),
//                    "CREATED"
//            );
//            paymentRepository.save(payment);
//
//            return new PaymentResponseDto(order.get("id"), "INR", amountInPaise, razorpayKeyId);
//
//        } catch (Exception e) {
//            throw new RuntimeException("Error while creating Razorpay order: " + e.getMessage());
//        }
//    }
//
//    @Override
//    public String verifyPayment(PaymentVerificationDto verificationRequest) {
//        try {
//            String orderId = verificationRequest.getRazorpayOrderId();
//            String paymentId = verificationRequest.getRazorpayPaymentId();
//            String signature = verificationRequest.getRazorpaySignature();
//
//            String payload = orderId + "|" + paymentId;
//
//            Mac mac = Mac.getInstance("HmacSHA256");
//            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
//            mac.init(secretKey);
//            byte[] hash = mac.doFinal(payload.getBytes());
//            String generatedSignature = Base64.getEncoder().encodeToString(hash);
//
//            if (generatedSignature.equals(signature)) {
//                Payment payment = paymentRepository.findByOrderId(orderId);
//                payment.setStatus("SUCCESS");
//                payment.setPaymentId(paymentId);
//                paymentRepository.save(payment);
//                return "Payment verified successfully!";
//            } else {
//                return "Payment verification failed!";
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Error verifying payment: " + e.getMessage());
//        }
//    }
//}
