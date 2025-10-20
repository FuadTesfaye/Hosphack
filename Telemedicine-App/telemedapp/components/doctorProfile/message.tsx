import Image from "next/image";
import userImage from "@/images/user.png";

type MessageParams = {
  senderType: string;
  senderName: string;
  time: string;
  text: string;
};

function Message({ senderType, senderName, time, text }: MessageParams) {
  const messageClass = `flex flex-col leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${senderType === "doctor" ? "bg-blue-600" : "bg-gray-600"}`;
  return (
    <div
      className="flex items-start gap-2.5 mx-2 mt-4"
      dir={senderType === "doctor" ? "rtl" : "ltr"}
    >
      <Image
        className="w-8 h-8 rounded-full"
        src={userImage}
        alt={`${senderType} Image`}
      />
      <div className="flex flex-col gap-1 w-full max-w-[fit-content]">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">
            {senderType === "doctor" ? `Dr. ${senderName}` : senderName}
          </span>
          <span className="text-sm font-normal text-gray-500" dir="ltr">
            {time}
          </span>
        </div>
        <div className={messageClass}>
          <p className="text-sm font-normal text-white">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
