import React, { useState } from "react";
import Pricing from "@/pages/utility/pricing";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { motion } from "framer-motion";


const PricingPage = () => {

    return (
        <div className="max-w-screen bg-white">
            <ParticleBackground />
            <motion.div
                className="pricing-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            >
                <Pricing />
            </motion.div>
        </div>

    );
};

export default PricingPage;