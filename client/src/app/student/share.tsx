"use client"
import React, { useState } from 'react';
import QRCodeModal from '@/components/modal/student-qr';
import MySwal from "@/lib/swal"; // ← Add this import

const VERIFIER_URL = process.env.NEXT_PUBLIC_VERIFIER_URL;
type Credential = {
  tokenId: string;
  credentialType?: string;
  credentialCode?: string;
  status?: string; // Make sure your credential objects have this field!
  // Add other fields if needed
};

interface ShareCredentialsProps {
  credentials: Credential[];
  loading: boolean;
}

export default function ShareCredentials({ credentials, loading }: ShareCredentialsProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");

  // Only show credentials with status "active"
  const activeCredentials = credentials.filter(
    (c) => c.status === "active"
  );

  // Build the sharing link based on selected credential
  const selectedCredential = activeCredentials.find((c) => c.tokenId === selectedTokenId);
  const shareLink = selectedCredential
    ? `${VERIFIER_URL}/verifier?tokenId=${selectedCredential.tokenId}`
    : "";

  // --- Suite Alert implementation for "copy link" ---
  async function handleCopyLink() {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      await MySwal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "The sharing link has been copied to your clipboard.",
        confirmButtonColor: "#b71c1c",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }

  return (
    <>
      <div className="card">
        <h2 className="card-title">Share Your Credentials</h2>
        <p className="share-card-subtitle">
          Generate a secure link or QR code to share your credentials with your employers or institutions.
        </p>
        <div className="share-form-row">
          <div className="share-form-group">
            <label htmlFor="credential">Select credentials to share:</label>
            <select
              id="credential"
              className="share-select-input"
              value={selectedTokenId}
              onChange={e => setSelectedTokenId(e.target.value)}
              disabled={loading || activeCredentials.length === 0}
            >
              <option value="">--Select Credential--</option>
              {activeCredentials.map((cred) => (
                <option key={cred.tokenId} value={cred.tokenId}>
                  {cred.credentialType || "Credential"} ({cred.credentialCode})
                </option>
              ))}
            </select>
            {activeCredentials.length === 0 && (
              <span style={{color: "#b71c1c", fontSize: 14}}>
                No active credentials available to share.
              </span>
            )}
          </div>
        </div>
        <div className="share-button-row">
          <button
            className="share-btn"
            disabled={!selectedTokenId}
            onClick={handleCopyLink}
          >
            Generate Sharing Link
          </button>
          <button
            className="share-btn"
            disabled={!selectedTokenId}
            onClick={() => setIsQRModalOpen(true)}
          >
            Generate QR Code
          </button>
        </div>
      </div>
      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrValue={shareLink}
      />
    </>
  );
}
