"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/ui/LoaderUI";
import { Loader2Icon, CalendarClock, Lightbulb } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import dayjs from "dayjs";

export default function Home() {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  };

  if (isLoading) return <LoaderUI />;

  const upcomingInterview = interviews?.length
    ? interviews.reduce((earliest, curr) =>
        dayjs(curr.startTime).isBefore(dayjs(earliest.startTime)) ? curr : earliest
      )
    : null;

  return (
    <div className="container max-w-6xl mx-auto px-8 py-14 space-y-20">
      {/* WELCOME SECTION */}
      <div className="rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white p-12 shadow-lg">
        <h1 className="text-4xl font-bold">{getGreeting()} Welcome back!</h1>
        <p className="mt-4 text-lg">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively."
            : "Access your upcoming interviews and preparations effortlessly."}
        </p>
      </div>

      {/* UPCOMING INTERVIEW */}
      {upcomingInterview && (
        <div className="p-6 bg-gray-100 border-l-4 border-green-500 rounded-lg flex items-center gap-6 shadow-md">
          <CalendarClock className="text-green-500 w-8 h-8" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Interview</h3>
            <p className="text-gray-800">
              Your next interview is scheduled on{' '}
              <span className="font-medium text-green-600">
                {dayjs(upcomingInterview.startTime).format("MMMM D, YYYY [at] h:mm A")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* INTERVIEWER ACTIONS */}
      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div>
            <h2 className="text-3xl font-semibold text-white">Your Interviews</h2>
            <p className="text-gray-700 mt-2">View and join your scheduled interviews</p>
          </div>

          {/* INTERVIEWS LIST */}
          <div>
            {interviews === undefined ? (
              <div className="flex justify-center py-14">
                <Loader2Icon className="h-10 w-10 animate-spin text-gray-400" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-14 text-gray-500">
                No scheduled interviews at the moment.
              </div>
            )}
          </div>

          {/* TIPS & GUIDANCE SECTION */}
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Lightbulb className="text-yellow-500 w-8 h-8" />
              <h2 className="text-2xl font-semibold text-gray-900">Interview Tips</h2>
            </div>
            {isCandidate && (
              <ul className="mt-4 space-y-3 text-gray-800">
                <li>✅ Prepare your questions and answers in advance.</li>
                <li>✅ Ensure your microphone and camera are working before the interview.</li>
                <li>✅ Dress professionally, even for virtual interviews.</li>
                <li>✅ Be punctual and join the meeting a few minutes early.</li>
                <li>✅ Take notes during the interview for better follow-ups.</li>
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
