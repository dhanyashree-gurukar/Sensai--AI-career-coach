"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronDown, FileText, GraduationCap, Home, LayoutDashboard, MessagesSquare, PenBox, StarIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
//import { checkUser } from "@/lib/checkUser";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
    {/*await checkUser();*/}

    useEffect(() => {
    const runCheck = async () => {
      try {
        await fetch("/api/check-user", { method: "POST" });
      } catch (error) {
        console.error("User check failed:", error);
      }
    };
    runCheck();
  }, []);
    const id = uuidv4();
    const { user } = useUser();
    const router = useRouter();

    const onClickButton = async () => {
        const result = await axios.post("/api/history", {
            recordId: id,
            content: []
        });
        console.log(result);
        router.push('/ai-chat' + "/" + id);
    }

    return (
        <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href='/'>
                    <Image src="/logo.png" alt="Sensai Logo" width={200} height={60} className="h-12 py-1 w-auto object-contain"/>
                </Link>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <SignedIn>
                        <Link href={'/'}>
                            <Button variant="outline">
                                <Home className="h-4 w-4" />
                                <span className="hidden md:block">Home</span>
                            </Button>
                        </Link>

                        <Link href={'/ai-chat' + "/" + id}>
                            <Button variant="outline" onClick={onClickButton}>
                                <MessagesSquare className="h-4 w-4" />
                                <span className="hidden md:block">AI Chatbot</span>
                            </Button>
                        </Link>

                        <Link href={'/onboarding'}>
                            <Button variant="outline">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden md:block">Industry Insights</span>
                            </Button>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <StarIcon className="h-4 w-4" />
                                    <span className="hidden md:block">Growth Tools</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href={"/resume"} className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span>Build Resume</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                                        <PenBox className="h-4 w-4" />
                                        <span>Cover Letter</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/interview"} className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>Interview Prep</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline">Sign In</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton 
                        appearance={{
                            elements:{
                                avatarBox: "w-10 h-10",
                                userButtonPopoverCard: "shadow-xl",
                                userPreviewMainIdentifier: "fobt-semibold",
                            },
                        }}
                        afterSignOutUrl="/"
                        />
                    </SignedIn>

                </div>

            </nav>
        
           
        </header>
    );
};
