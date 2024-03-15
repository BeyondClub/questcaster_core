"use client";
import { motion } from "framer-motion";
import { useState } from "react";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import Form from "../components/Form";
const WalletProvider = dynamic(() => import("./WalletProvider"), {
  ssr: false,
});

const NewPage = () => {
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState("");

  return (
    <WalletProvider>
      <main className="min-h-screen bg-black px-2  md:px-32 py-10">
        <div className="fixed inset-0 overflow-hidden -z-0">
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-[10%] left-[90%]">
            <motion.div
              initial={{ scale: 0.3, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.75 } }}
              className="blur-[6px] h-[250vw] w-[250vw] min-w-[1400px] min-h-[1300px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,233,255,1) 0%, rgba(255,210,255,1) 0.3%, rgba(255,194,255,1) 0.5%, rgba(255,190,255,1) 0.6%, rgba(253,180,255,1) 0.8%, rgba(253,173,255,1) 0.9%, rgba(243,168,255,1) 1.1%, rgba(234,161,244,1) 1.5%, rgba(231,158,242,1) 1.6%, rgba(229,157,240,1) 1.7%, rgba(200,145,220,1) 2%, rgba(179,126,190,1) 2.4%, rgba(152,108,153,1) 3.2%, rgba(121,87,123,1) 4.8%, rgba(112,81,119,1) 5.6%, rgba(98,74,114,1) 7%, rgba(92,70,108,1) 8%, rgba(60,49,75,1) 20%, rgba(7,5,10,1) 50%,rgba(0,0,0,0) 100%)",
              }}
            ></motion.div>
          </div>
        </div>
        <Toaster position="bottom-center" />

        <header className="grid place-items-center mb-10">
          <img
            src="/images/logo.svg"
            alt="questcater"
            className="z-20 w-72"
            style={{ zIndex: "999" }}
          />
        </header>

        <div className="flex justify-center items-center">
          {!success && (
            <div
              className="w-full md:w-[800px] mx-auto  border border-gray-900 shadow-sm rounded-xl  p-7 px-7  z-50"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <h1 className="font-medium text-3xl">Create a Frame Quest</h1>
              <Form setSuccess={setSuccess} setLink={setLink} />
            </div>
          )}
          {success && (
            <div
              className="max-w-xl mx-auto  border border-gray-900 shadow-sm rounded-xl text-center  p-7 px-7  z-50"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <h1 className="font-medium text-3xl">
                Here's your frame link 🎉
              </h1>
              <p className="mt-3">{link}</p>
            </div>
          )}
        </div>
      </main>
    </WalletProvider>
  );
};

export default NewPage;
