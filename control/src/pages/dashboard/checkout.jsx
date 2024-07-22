import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '@/App';
import Checkout from "@/components/payments/Checkout";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { retrievePurchase, getPaymentMethods } from "@/constant/apiData";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [purchaseData, setPurchaseData] = useState(null); 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch purchase data and payment methods in a single request
        const [purchaseDataResponse, paymentMethodsResponse] = await Promise.all([
          retrievePurchase(),
          getPaymentMethods(),
        ]);

        // Update states with fetched data
        setPurchaseData(purchaseDataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function
  }, []); // Run only once when the component mounts

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
