import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/Components/shadcnui/checkbox";
import { Label } from "@/Components/shadcnui/label";

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export default function DataPrivacyPolicyModal({ isOpen, onClose, onAccept }: PrivacyPolicyModalProps) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 10) {
                setHasScrolledToBottom(true);
            }
        }
    };

    const handleAccept = () => {
        if (isChecked) {
            onAccept();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Privacy Policy</DialogTitle>
                </DialogHeader>
                
                <div 
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="mt-4 max-h-[50vh] overflow-y-auto pr-4 space-y-4"
                >
                    <h3 className="text-lg font-semibold">1. Information We Collect</h3>
                    <p>
                        We collect information that you provide directly to us, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Personal identification information (Name, gender, email address, phone number)</li>
                        <li>Professional information (Department, staff type, work group)</li>
                        <li>Account credentials</li>
                    </ul>

                    <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide and maintain our services</li>
                        <li>Process and manage work orders</li>
                        <li>Send notifications about your account and services</li>
                        <li>Improve our services and user experience</li>
                    </ul>

                    <h3 className="text-lg font-semibold">3. Data Security</h3>
                    <p>
                        We implement appropriate security measures to protect your personal information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Encryption of sensitive data</li>
                        <li>Regular security assessments</li>
                        <li>Access controls and authentication</li>
                    </ul>

                    <h3 className="text-lg font-semibold">4. Your Rights</h3>
                    <p>
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access your personal information</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of communications</li>
                    </ul>

                    <h3 className="text-lg font-semibold">5. Contact Us</h3>
                    <p>
                        For your data privacy inquiries, you may reach our Data Protection Officer through the following means
                        <br />
                        Email: dpo@laverdad.edu.ph
                        <br />
                        Phone: (123) 456-7890
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="privacy-checkbox" 
                            checked={isChecked}
                            onCheckedChange={(checked) => setIsChecked(checked === true)}
                            disabled={!hasScrolledToBottom}
                        />
                        <Label htmlFor="privacy-checkbox">
                            I have read and understood the privacy policy
                        </Label>
                    </div>

                    {hasScrolledToBottom && isChecked && (
                        <DialogFooter>
                            <Button 
                                onClick={handleAccept}
                                className="w-full bg-secondary hover:bg-primary"
                                    >
                                        Accept and Continue
                            </Button>
                        </DialogFooter>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}