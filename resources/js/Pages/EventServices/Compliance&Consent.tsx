import React, { useState } from "react";

const ComplianceAndConsent = ({
    dataPrivacyAgreed,
    onChangeDataPrivacy,
    equipmentPolicyAgreed,
    onChangeEquipmentPolicy,
    consentChoice,
    onConsentChange,
    onClose,
    onSubmit,
    isModal,
}: {
    dataPrivacyAgreed: boolean;
    onChangeDataPrivacy: (e: React.ChangeEvent<HTMLInputElement>) => void;
    equipmentPolicyAgreed: boolean;
    onChangeEquipmentPolicy: (e: React.ChangeEvent<HTMLInputElement>) => void;
    consentChoice: string;
    onConsentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose?: () => void;
    onSubmit?: () => void;
    isModal?: boolean;
}) => {
    const [localError, setLocalError] = useState<string | null>(null);

    const handleConfirm = () => {
        if (
            !dataPrivacyAgreed ||
            !equipmentPolicyAgreed ||
            consentChoice !== "agree"
        ) {
            setLocalError(
                "You must agree to all terms and consent to proceed."
            );
            return;
        }
        setLocalError(null);
        if (onSubmit) onSubmit();
    };

    return (
        <div
            className={
                isModal
                    ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                    : ""
            }
        >
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto min-h-[300px] mx-auto">
                {isModal && (
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl p-1"
                        onClick={onClose}
                    >
                        ×
                    </button>
                )}
                <div className="space-y-8">
                    {/* Data Privacy Notice */}
                    <div className="border-b pb-6">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">
                            Data Privacy Notice{" "}
                            <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-md text-gray-700 mb-4 italic">
                            In compliance with data privacy laws, such as, but
                            not limited to, Republic Act No. 10173 (Philippine
                            Data Privacy Act of 2012) and implementing rules and
                            regulations, we within the Organization of La Verdad
                            Christian College, Inc. (LVCC), collect and process
                            your personal information in this Request Form for
                            Event Services purposes only, keeping them securely
                            and with confidentiality using our organizational,
                            technical, and physical security measures, and
                            retain them in accordance with our Retention Policy.
                            We don’t share them to any external group without
                            your consent, unless otherwise stated in our Privacy
                            Notice. You have the right to be informed, to
                            object, to access, to rectify, to erase or to block
                            the processing of your personal information, as well
                            as your right to data portability, to file a
                            complaint and be entitled to damages for violation
                            of your rights under this data privacy.
                        </p>
                        <p className="text-md text-gray-700 mb-4 italic">
                            For your data privacy inquiries, you may reach our
                            Data Protection Officer through:{" "}
                            <a
                                href="mailto:dpo@laverdad.edu.ph"
                                className="text-blue-600 underline"
                            >
                                dpo@laverdad.edu.ph
                            </a>
                        </p>
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={dataPrivacyAgreed}
                                onChange={onChangeDataPrivacy}
                                className="form-checkbox text-blue-600"
                            />
                            <span>
                                I have read and agree to the data privacy policy
                            </span>
                        </label>
                    </div>

                    {/* Equipment Return Policy */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Compliance and Consent{" "}
                            <span className="text-red-500">*</span>
                        </h2>
                        <h3 className="font-medium text-gray-800 mb-1">
                            Equipment Return Policy
                        </h3>
                        <p className="text-md text-gray-700 mb-4 italic">
                            The borrower acknowledges full responsibility for
                            the use, maintenance, and timely return of all
                            borrowed equipment and facilities, ensuring they are
                            returned in the same condition as when received, and
                            agrees to cover any damages or losses that occur
                            during the borrowing period.
                        </p>
                        <label className="inline-flex items-center space-x-2 mb-4 block">
                            <input
                                type="checkbox"
                                checked={equipmentPolicyAgreed}
                                onChange={onChangeEquipmentPolicy}
                                className="form-checkbox text-blue-600"
                            />
                            <span>
                                I acknowledge and agree to the equipment return
                                policy
                            </span>
                        </label>

                        <p className="text-md text-gray-700 mb-2 italic">
                            I voluntarily give my consent in collecting,
                            processing, recording, using, and retaining my
                            personal information for the above-mentioned purpose
                            in accordance with this Privacy Notice.
                        </p>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="consent"
                                    value="agree"
                                    checked={consentChoice === "agree"}
                                    onChange={onConsentChange}
                                    className="form-radio text-blue-600"
                                />
                                <span>I agree</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="consent"
                                    value="disagree"
                                    checked={consentChoice === "disagree"}
                                    onChange={onConsentChange}
                                    className="form-radio text-blue-600"
                                />
                                <span>I disagree</span>
                            </label>
                        </div>
                    </div>
                </div>
                {localError && (
                    <div className="text-red-500 text-sm mt-4 text-center">
                        {localError}
                    </div>
                )}
                {isModal && (
                    <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                        <button
                            className="w-full sm:w-auto px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-full sm:w-auto px-8 py-2 bg-secondary hover:bg-primary text-white rounded-md"
                            onClick={handleConfirm}
                        >
                            Confirm & Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplianceAndConsent;
