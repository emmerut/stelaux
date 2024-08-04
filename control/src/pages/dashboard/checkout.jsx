import React, { useState, useContext, useEffect } from "react";
import Checkout from "@/components/payments/Checkout";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { retrievePurchase, getPaymentMethods } from "@/constant/apiData";
import UseAuth from "@/components/auth/UseAuth";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { userData } = UseAuth();
  const [purchaseData, setPurchaseData] = useState(null); 
  
  useEffect(() => {
    const fetchData = async () => {
      if (!userData) {
        return;
      } 
      try {
        // Fetch purchase data and payment methods in a single request
        const [purchaseDataResponse, paymentMethodsResponse] = await Promise.all([
          retrievePurchase(),
          getPaymentMethods(),
        ]);

        // Update states with fetched data
        setPurchaseData(purchaseDataResponse);
      } catch (error) {
        navigate('/plans')
      }
    };

    fetchData(); 
  }, [userData]); 

  return (
    <div className="max-w-screen bg-white">
      <ParticleBackground />
      <motion.div
        className="pricing-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Pass purchaseData and paymentMethods to Checkout */}
        {userData && <Checkout purchaseData={purchaseData} userData={userData} />} 
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
