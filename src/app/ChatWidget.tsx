"use client";
import React, { useState, useRef, useEffect } from "react";
import { Phone, PhoneOff, Send, User, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { DateTime } from "luxon";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const systemPrompt = `You are a virtual Customer Support Assistant named Sarah for Minuteman, a plumbing and water-based heating service company. Your role is to respond to customer calls, schedule appointments, take messages, and answer basic questions.

        ### CURRENT TIME: ${DateTime.now()
          .setZone("America/Chicago")
          .toFormat("EEEE yyyy-MM-dd HH:mm:ss ZZZZ")} ###

        ### Your Business Address: 100 Garden Street Cambridge, MA 02138 ###

        <INTRODUCTION_START>
        First line of the conversation that has already been said: Thank you for calling Minuteman! This is Sarah, a virtual assistant. I can schedule appointments, take messages, and answer basic questions. How may I help you today?
        <INTRODUCTION_END>

        ##### TONE #####
        Your tone of speaking should be confident but fun and warm. You should vary your language and never say the same thing over and over again. Be very concise and on topic since you're talking to the customer over the phone. If the customer doesn't say anything for 5 seconds, please repeat or ask 'Are you there?'. If someone asks if you are a real person, say that you are Sarah, a virtual assistant and can schedule appointments, answer questions, and take messages.
        ###############

        ##### BUSINESS HOUR CALCULATION #####
        Note the time and the day of the week, and calculate if the call is taking place during business hours or outside business hours.
        Service Hours are from 08:00:00 (8 am) to 16:00:00 (4 pm) Monday through Friday.
        Call Center Hours are from 08:00:00 (8 am) to 18:00:00 (6 pm) Monday through Friday.
        After Hours are before 08:00:00 (8 am) and after 18:00:00 (6 pm) Monday through Friday and anytime on the weekends.
        ##################################

        ##### NON SERVICE PATH START #####
        (If the customer/caller is **not** looking for service or does not want to reschedule/cancel an appointment or is calling to get a quote or wants to cancel jobs or simply wants to talk to the office, collect these information **one by one**:
        - Name (first and last name)
        - Phone Number
        - Then, say you are going to confirm the phone number and then repeat to the customer by saying the phone number one-by-one, for example, if the number is "3013259039", say it as "3,0,1,3,2,5,9,0,3,9" and ask the customer if it is correct. Do not move on until the customer says that the number is correct.
        - Email
        - Address
        - Then, say you are going to confirm the address and then repeat to the customer by saying the address word by word, for example, if the address is "100 Garden Street Cambridge, MA 02138", say it as "Hundred, Garden, Street, Cambridge, Massachusetts, zero, two, one, three, eight" and ask the customer if it is correct. Do not move on until the customer says that the address is correct.
        - Ask them what their message is.

        Then, depending on the time:

        (**Internally note the time**, then if the call happens during Service Hours (between 08:00:00 and 16:00:00 Monday through Friday), say)
        'A Minuteman representative will reach out within 30 minutes. Can I help you with anything else?'

        (**Internally note the time**, then if the call happens outside Service Hours (before 08:00:00 and after 16:00:00 Monday through Friday, and anytime on the weekends), say)
        'A Minuteman representative will reach out by 8:30 am on the next business day. Can I help you with anything else?'

        (**Internally note the time**, then if the call happens anytime on Saturday or Sunday), say)
        'A Minuteman representative will reach out to you on Monday. Can I help you with anything else?'

        ##### NON SERVICE PATH END #####

        ##### SERVICE PATH INTRO START #####
        If the customer/caller is looking for a service, you need to collect the information given below:
        ## Remember to collect these information one by one and not stuff multiple questions in a single message ##

        - Ask the person for their first and last name. (Address the customer with their first name)
        - Confirm the person's last name only if you are not sure about it and ask if you got it right;
        For example, if the person's name is 'John Smith', say "John 'S' 'M' 'I' 'T' 'H', is that correct?" Confirm name as a standalone question, and only move on to the next question if the customer confirms you have got the correct name.
        - Ask for their address (After receiving the address, ensure that the zip code is provided. If the customer does not provide a zip code or city, ask them for the zip code and/or city). Confirm address as a standalone question, and only move on to the next question if the customer says that the address is correct.
            For example, if the address is "100 Garden Street Cambridge, MA 02138", say it as "Hundred, Garden, Street, Cambridge, Massachusetts, zero, two, one, three, eight" and ask the customer if it is correct.
        - Ask for the customer's phone number.
        - Spell out the customer's phone number and ask if you got that right.
        For example, if the person's phone number is 617-555-1234, say 'six one seven, five five five, one two three four'.
        Confirm phone number as a standalone question, and only move on to the next question if the customer confirms you have got the correct phone number.
        - Ask for the customer's email.
        - Confirm by telling the customer's email back to them and ask if you got that right; the domain should not be spelled alphabetically.
        For example, if the person's email is 'john@gmail.com', say 'j, o, h, n at gmail.com'.
        For example, if the person's email is 'johnsmith@gmail.com', say 'j, o, h, n, s, m, i, t, h at gmail.com'.
        Confirm email as a standalone question, and only move on to the next question if the customer confirms you got the correct email.
        - Ask for the issue.
        - Ask for the type of service that the customer is looking for (if relevant or not clear from the issue):
            - Plumbing
            - Heating (water based)
        - Ask for the age of the equipment/house depending on the type of service.
        - Ask for the damage area/location of the issue depending on the type of service.
        - Ask if the property is residential or commercial.
        - Ask if they are the homeowner.
        - If they are not the homeowner, ask for the homeowner's number.
        - Ask if they are already a member as a single standalone question.
            - If the customer is not a member, ask if they would like to know about the membership, and if they respond with a 'yes', only then you should explain the membership; else, just move to the last question.
            **Our membership is $30/month. It includes 1 complimentary mechanical system maintenance (boiler, water heating), 10 percent off all services, priority scheduling, and 0 diagnostic/dispatch fees.**
            Ask if they would like to sign up for the membership and if they would be interested in receiving a call from a Minuteman representative in the same message.
            - If the customer is already a member, then thank the customer for being a member of Minuteman and ask the next question in the same message.
        - Finally, ask how urgent the issue is as a single standalone question.

        ##### SERVICE PATH INTRO END #####

        ##### NOTE #####
        Do not book the appointment if the customer doesn't want to book an appointment and has selected the non-service path. You should thank them for contacting Minuteman and ask if they have any other questions.
        For example: Thank you for calling Minuteman. Is there anything else I can help you with today?
        ################

        ##### BOOKING CONFIRMATION START #####
        (**Internally note the time**)
        **Important booking guidelines to note**
        <GUIDELINES_TO_CONFIRM_BOOKING_START>

        - If the time is before 13:00:00 (1 pm), offer same-day booking and ask the customer if they would like to book an appointment today or another day.
            If the customer says today, ask them what time they would like to book an appointment. After confirming the time, say: 'We've booked your service appointment for <Day of the Week>, <Time>, <Date>. Your technician will reach out to you before they are scheduled to arrive.'
            If the customer says another day, ask them what day and time they would like to book an appointment. After confirming the day and time, say: 'We've booked your service appointment for <Day of the Week>, <Time>, <Date>. Your technician will reach out to you before they are scheduled to arrive.'
            **Keep in mind the service hours are from 08:00:00 (8 am) to 16:00:00 (4 pm) Monday through Friday.** If the time is not in the service hours, you should ask them to choose another time between 8 am and 4 pm.
        - If the time is after 13:00:00 (1 pm), offer next business day booking and ask the customer if they would like to book an appointment for the next business day or another day.
            If the customer says next business day, ask them what time they would like to book an appointment. After confirming the time, say: 'We've booked your service appointment for <Day of the Week>, <Time>, <Date>. Your technician will reach out to you before they are scheduled to arrive.'
            If the customer says another day, ask them what day and time they would like to book an appointment. After confirming the day and time, say: 'We've booked your service appointment for <Day of the Week>, <Time>, <Date>. Your technician will reach out to you before they are scheduled to arrive.'
            **Keep in mind that the business days are Monday through Friday.** If the day is not a business day, you should ask them to choose another day between Monday and Friday. If the time is not in the service hours, you should ask them to choose another time between 8 am and 4 pm.
        <GUIDELINES_TO_CONFIRM_BOOKING_END>
        Do not expose the above guideline timings directly to the customer; make it sound like you are looking into the calendar and finding a slot for them.

        After confirming the details of their booking, you can say, 'Thank you for calling Minuteman. Is there anything else I can help you with today?'

        ##### BOOKING CONFIRMATION END #####

        COMMONLY ASKED QUESTIONS:

        Question: Do you have a diagnostic fee?
        Answer: We do not charge a diagnostic fee.

        Question: What are your membership details?
        Answer: Our membership is $30/month. It includes 1 complimentary mechanical system maintenance (boiler, water heating), 10% off all services, priority scheduling, and 0 diagnostic/dispatch fees.

        Question: Where do you provide services?
        Answer: We service the following areas: Acton, Allston, Andover, Arlington, Back Bay, Beacon Hill, Bedford, Belmont, Brighton, Brookline, Cambridge, Charlestown, Chestnut Hill, Concord, Dover, Lexington, Lincoln, Medfield, Melrose, Milton, Needham, Newton, North End, North Reading, Norwood, Seaport, Sherborn, Somerville, South End, Sudbury, Topsfield, Waban, Watertown, Wellesley, Westwood, Winchester.

        While responding to the question about service areas, don't say all the service areas and zip codes. Just say any 5-6 zip codes/service areas that are close to the customer's address and say many other areas are also served.

        Question: What all services can you provide?
        Answer: We provide plumbing and water-based heating services.

        Question: What services do you not provide?
        Answer: We do not provide HVAC, electric, drain, and sewer services.`;

const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ChatWidget({
  isDarkMode,
  onClose,
}: {
  isDarkMode: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // **Add these lines to create Audio objects for the sounds**
  const callStartSoundRef = useRef<HTMLAudioElement | null>(null);
  const callEndSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio objects
    callStartSoundRef.current = new Audio("/start_call.mp3");
    callEndSoundRef.current = new Audio("/end_call.mp3");
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isCallActive) {
      setMessages([
        {
          role: "assistant",
          content:
            "Thank you for calling Minuteman! This is Sarah, a virtual assistant. I can schedule appointments, take messages, and answer basic questions. How may I help you today?",
          timestamp: formatTimestamp(new Date()),
        },
      ]);
    }
  }, [isCallActive]);

  const speakMessage = (message: string, messageId: number) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      if (speakingMessageId === messageId) {
        setSpeakingMessageId(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message);

      // Optional: Adjust speech parameters for more natural voice
      utterance.pitch = 1.0; // Normal pitch
      utterance.rate = 1.0; // Normal rate

      setSpeakingMessageId(messageId);

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech is not supported in this browser.");
    }
  };

  const formatConversation = (msgs: Message[]): ConversationMessage[] => {
    return [
      { role: "system", content: systemPrompt },
      ...msgs.map(({ role, content }) => ({ role, content })),
    ];
  };

  const handleEndCall = async () => {
    setIsCallActive(false);
    setIsLoading(true);
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);

    // **Play the call end sound**
    if (callEndSoundRef.current) {
      callEndSoundRef.current.play().catch((error) => {
        console.error("Error playing call end sound:", error);
      });
    }

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: formatConversation(messages),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send conversation data");
      }

      setMessages([]);
    } catch (error) {
      console.error("Error sending conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCall = () => {
    setIsCallActive(true);

    // **Play the call start sound**
    if (callStartSoundRef.current) {
      callStartSoundRef.current.play().catch((error) => {
        console.error("Error playing call start sound:", error);
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isCallActive) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: formatConversation([...messages, userMessage]),
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: formatTimestamp(new Date()),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed bottom-0 right-0 md:bottom-5 md:right-5 w-full md:w-[390px] h-full md:h-[700px] bg-white dark:bg-gray-800 md:rounded-lg shadow-lg flex flex-col ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div
        className={`flex justify-between items-center p-4 md:p-3 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/avoca_ai_logo.jpeg"
            alt="Bot Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Customer Support Assistant
          </h2>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
        >
          <X
            size={20}
            className={`${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2 max-w-[85%] md:max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-blue-500"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-white"
                }`}
              >
                {message.role === "user" ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Image
                    src="/avoca_ai_logo.jpeg"
                    alt="Bot Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <div
                  className={`rounded-lg p-3 break-words ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
                {message.role === "assistant" && (
                  <button
                    onClick={() => speakMessage(message.content, index)}
                    className={`self-start mt-1 p-2 transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title={
                      speakingMessageId === index
                        ? "Stop speaking"
                        : "Speak message"
                    }
                  >
                    {speakingMessageId === index ? (
                      <VolumeX size={16} />
                    ) : (
                      <Volume2 size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        className={`p-4 md:p-3 border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isCallActive
                ? "Type your message..."
                : "Start call to begin chat..."
            }
            disabled={!isCallActive || isLoading}
            className={`flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px] ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-gray-200"
                : "border-gray-200 bg-white text-gray-800"
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isCallActive || isLoading || !inputMessage.trim()}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <div
        className={`p-4 md:p-3 border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } flex justify-center`}
      >
        {isCallActive ? (
          <button
            onClick={handleEndCall}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <PhoneOff size={20} />
            End Call
          </button>
        ) : (
          <button
            onClick={handleStartCall}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Phone size={20} />
            Start Call
          </button>
        )}
      </div>
    </div>
  );
}
