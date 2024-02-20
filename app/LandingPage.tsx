"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useState } from "react";
import { Toaster, toast } from "sonner";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const onFormSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      toast.error("Invalid Email");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/allowlist", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);

    if (res.ok) {
      confetti({
        particleCount: 150,
        spread: 60,
      });
      toast.success("You have been added to the waitlist");
      setCompleted(true);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="grid place-content-center space-y-10 place-items-center text-gray-100 min-h-screen p-5">
      <div className="fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-[10%] left-[90%]">
          <motion.div
            initial={{ scale: 0.3, opacity: 0.3 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.75 } }}
            className="blur-[6px] h-[250vw] w-[250vw] min-w-[1400px] min-h-[1400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,233,255,1) 0%, rgba(255,210,255,1) 0.3%, rgba(255,194,255,1) 0.5%, rgba(255,190,255,1) 0.6%, rgba(253,180,255,1) 0.8%, rgba(253,173,255,1) 0.9%, rgba(243,168,255,1) 1.1%, rgba(234,161,244,1) 1.5%, rgba(231,158,242,1) 1.6%, rgba(229,157,240,1) 1.7%, rgba(200,145,220,1) 2%, rgba(179,126,190,1) 2.4%, rgba(152,108,153,1) 3.2%, rgba(121,87,123,1) 4.8%, rgba(112,81,119,1) 5.6%, rgba(98,74,114,1) 7%, rgba(92,70,108,1) 8%, rgba(60,49,75,1) 20%, rgba(7,5,10,1) 50%,rgba(0,0,0,0) 100%)",
            }}
          ></motion.div>
        </div>
      </div>

      <Toaster position="bottom-center" />

      <div className="space-y-10 drop-shadow-2xl home">
        <motion.img
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { stiffness: 100 } }}
          src="/images/logo.svg"
          alt="questcater"
        />

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, stiffness: 100 },
          }}
          className="text-4xl text-center"
        >
          The easiest way to boost <br /> community engagement with Frames
        </motion.p>

        <motion.form
          onSubmit={onFormSubmit}
          initial={{ opacity: 0, y: 50, gap: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            gap: "1.5rem",
            transition: { delay: 0.4, stiffness: 100 },
          }}
          className="flex-col md:flex-row flex w-full"
        >
          <input
            type="text"
            required
            className="p-3 rounded-md md:w-3/4 bg-white text-gray-900"
            placeholder="Email address"
            disabled={completed}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={completed || loading}
            type="submit"
            className="bg-black text-white shadow-[0_0_6px_0_#ffffff50] rounded-full px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            Join Waitlist
          </button>
        </motion.form>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.75 } }}
        className="flex items-center z-20"
      >
        Built on
        <img src="images/farcaster.svg" alt="farcaster" className="ml-2" />
      </motion.p>
    </main>
  );
}
