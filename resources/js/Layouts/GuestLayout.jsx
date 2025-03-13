// import ApplicationLogo from '@/Components/ApplicationLogo';
// import { Link } from '@inertiajs/react';

// export default function GuestLayout({ children }) {
//     return (
//         <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
//             <div>
//                 <Link href="/">
//                     <ApplicationLogo className="h-20 w-20 fill-current text-rose-500" />
//                 </Link>
//             </div>

//             <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-lg sm:rounded-lg dark:bg-gray-800">
//                 {children}
//             </div>
//         </div>
//     );
// }

// GuestLayout.jsx (or wherever your layout component is)

import React from 'react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Left side (Form part) */}
            <div className="w-1/2 flex items-center justify-center bg-whtie-50">
                {children}
            </div>
            {/* Right side (Image part) */}
            <div
                className="w-1/2 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/LVBuilding.jpg')" }}
            ></div>
        </div>
    );
}
