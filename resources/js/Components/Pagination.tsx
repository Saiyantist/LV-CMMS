// import React from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface PaginationProps {
//     totalPages: number;
//     currentPage: number;
//     onPageChange: (page: number) => void;
//     siblingCount?: number; // number of pages shown around current page
//     links: any;
// }

// const Pagination: React.FC<PaginationProps> = ({
//     totalPages,
//     currentPage,
//     onPageChange,
//     siblingCount = 1,
// }) => {
//     const DOTS = "...";

//     const generatePages = () => {
//         const pages: (number | string)[] = [];
//         const startPage = Math.max(currentPage - siblingCount, 1);
//         const endPage = Math.min(currentPage + siblingCount, totalPages);

//         if (startPage > 2) {
//             pages.push(1, DOTS);
//         } else {
//             for (let i = 1; i < startPage; i++) pages.push(i);
//         }

//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(i);
//         }

//         if (endPage < totalPages - 1) {
//             pages.push(DOTS, totalPages);
//         } else {
//             for (let i = endPage + 1; i <= totalPages; i++) pages.push(i);
//         }

//         return pages;
//     };

//     const pages = generatePages();

//     return (
//         <div className="flex justify-center mt-6">
//             <nav className="inline-flex items-center space-x-1 rounded-xl bg-white shadow-md px-3 py-2">
//                 <button
//                     onClick={() => onPageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                     <ChevronLeft className="w-5 h-5" />
//                 </button>

//                 {pages.map((page, idx) =>
//                     page === DOTS ? (
//                         <span key={idx} className="px-3 py-1 text-gray-400">
//                             {DOTS}
//                         </span>
//                     ) : (
//                         <button
//                             key={idx}
//                             onClick={() => onPageChange(Number(page))}
//                             className={`px-3 py-1 rounded-md text-sm font-medium transition ${
//                                 currentPage === page
//                                     ? "bg-blue-600 text-white"
//                                     : "text-gray-700 hover:bg-gray-100"
//                             }`}
//                         >
//                             {page}
//                         </button>
//                     )
//                 )}

//                 <button
//                     onClick={() => onPageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                     <ChevronRight className="w-5 h-5" />
//                 </button>
//             </nav>
//         </div>
//     );
// };

// export default Pagination;
