"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const HeroSection = () => {

    const imageRef = useRef(null);

    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition > scrollThreshold){
                imageElement.classList.add("scrolled");
            }else{
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleGetStarted = () => {
    if (!isSignedIn) {
      router.push("/sign-in"); // Redirect to sign-in if not signed in
    } else {
      router.push("/dashboard"); // Redirect to dashboard if signed in
    }
  };

    return (
        <section className="w-full pt-36 md:pt-48 pb-10">
            <div className="space-y-6 text-center">
                <div className="space-y-6 mx-auto">
                    <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
                        Your AI Career Couch for<br /> Professional Success</h1>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                        Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8" onClick={handleGetStarted}>Get Strarted</Button>
                    </Link>
                </div>

                <div className="hero-image-wrapper mt-5 md:mt-0">
                    <div ref={imageRef} className="hero-image">
                        <Image 
                            src={"/banner3.jpeg"}
                            width={1280}
                            height={720}
                            alt="Banner Sensai"
                            className="rounded-lg shadow-2xl border mx-auto"
                            priority
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;