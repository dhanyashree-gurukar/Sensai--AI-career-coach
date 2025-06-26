import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/data/industries";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboarding-form";

const OnboardingPage = async ({ searchParams }) => {
    const { isOnboarded } = await getUserOnboardingStatus();

    const isEdit = searchParams?.edit === "true";

    if(isOnboarded && !isEdit) {
        redirect("/dashboard");
    }

    return (
        <main>
            <OnboardingForm industries={industries}/>
        </main>
    );
};

export default OnboardingPage;