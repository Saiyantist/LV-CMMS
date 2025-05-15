// import React from "react";

// interface EventDetailsModalProps {
//     open: boolean;
//     onClose: () => void;
//     details: {
//         name: string;
//         department?: string;
//         eventPurpose?: string;
//         participants?: string;
//         numberOfParticipants?: number;
//         [key: string]: any;
//     };
// }

// const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
//     open,
//     onClose,
//     details,
// }) => {
//     if (!open) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//             <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
//                 <button
//                     className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
//                     onClick={onClose}
//                 >
//                     ×
//                 </button>
//                 <h2 className="text-2xl font-bold mb-2 text-center">
//                     Event Details
//                 </h2>
//                 <div className="space-y-4 mt-6">
//                     <div>
//                         <span className="font-semibold">Event Name:</span>{" "}
//                         {details.name}
//                     </div>
//                     <div>
//                         <span className="font-semibold">Department:</span>{" "}
//                         {details.department || "Not specified"}
//                     </div>
//                     <div>
//                         <span className="font-semibold">Event Purpose:</span>{" "}
//                         {details.eventPurpose || "Not specified"}
//                     </div>
//                     <div>
//                         <span className="font-semibold">Participants:</span>{" "}
//                         {details.participants || "Not specified"}
//                     </div>
//                     <div>
//                         <span className="font-semibold">
//                             Number of Participants:
//                         </span>{" "}
//                         {details.numberOfParticipants || "Not specified"}
//                     </div>
//                 </div>
//                 <div className="flex justify-end mt-8">
//                     <button
//                         className="px-8 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md"
//                         onClick={onClose}
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EventDetailsModal;
