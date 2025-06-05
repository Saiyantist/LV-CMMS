import { ChevronUp } from "lucide-react";

interface ScrollToTopButtonProps {
    showScrollUpButton: boolean;
    scrollToTop: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
    showScrollUpButton,
    scrollToTop,
}) => {
    if (!showScrollUpButton) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-50 bg-secondary hover:bg-primary text-white p-3 md:p-4 rounded-full shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
        >
            <ChevronUp size={20} />
        </button>
    );
};

export default ScrollToTopButton;
