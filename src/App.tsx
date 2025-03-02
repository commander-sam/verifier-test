import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { verifyEmail, VerificationStatus } from './utils/emailVerification';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<VerificationStatus>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [domain, setDomain] = useState('');

  const checkEmail = async () => {
    setIsChecking(true);
    setErrorMessage('');
    
    try {
      if (!email.trim()) {
        setErrorMessage('Email cannot be empty');
        setStatus(null);
        setIsChecking(false);
        return;
      }
      
      // Step 1: Syntax validation
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email.toLowerCase())) {
        setStatus('invalid');
        setIsChecking(false);
        return;
      }
      
      // Extract domain
      const emailDomain = email.split('@')[1].toLowerCase();
      setDomain(emailDomain);
      
      // Step 3: Perform full verification
      const result = await verifyEmail(email);
      setStatus(result);
      
      if (!result) {
        setErrorMessage('Email cannot be empty');
      }
    } catch (error) {
      setErrorMessage('An error occurred during verification');
      setStatus('unknown');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return '';
    
    switch (status) {
      case 'safe':
        return 'text-green-500';
      case 'role':
      case 'catchAll':
        return 'text-blue-500';
      case 'disposable':
      case 'inboxFull':
        return 'text-amber-500';
      case 'invalid':
      case 'disabled':
      case 'spamtrap':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    if (!status) return '';
    
    switch (status) {
      case 'safe':
        return 'Deliverable';
      case 'role':
        return 'Deliverable (Role)';
      case 'catchAll':
        return 'Deliverable (Catch-All)';
      case 'disposable':
        return 'Risky (Disposable)';
      case 'inboxFull':
        return 'Undeliverable (Full)';
      case 'invalid':
        return 'Undeliverable';
      case 'disabled':
        return 'Undeliverable (Disabled)';
      case 'spamtrap':
        return 'Dangerous (Spamtrap)';
      default:
        return 'Unknown';
    }
  };

  const getReasonText = () => {
    if (!status) return '';
    
    switch (status) {
      case 'safe':
        return 'ACCEPT EMAIL';
      case 'role':
        return 'ACCEPT EMAIL';
      case 'catchAll':
        return 'PROCEED WITH CAUTION';
      case 'disposable':
        return 'TEMPORARY EMAIL';
      case 'inboxFull':
        return 'INBOX FULL';
      case 'invalid':
        return 'INVALID ADDRESS';
      case 'disabled':
        return 'ACCOUNT DISABLED';
      case 'spamtrap':
        return 'SPAM TRAP';
      default:
        return 'UNKNOWN STATUS';
    }
  };

  const getReasonColor = () => {
    if (!status) return '';
    
    switch (status) {
      case 'safe':
      case 'role':
        return 'bg-green-100 text-green-800';
      case 'catchAll':
        return 'bg-blue-100 text-blue-800';
      case 'disposable':
      case 'inboxFull':
        return 'bg-amber-100 text-amber-800';
      case 'invalid':
      case 'disabled':
      case 'spamtrap':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDescription = () => {
    if (!status) return '';
    
    switch (status) {
      case 'safe':
        return 'You can safely send emails to this address, we have confirmation that the address does exist.';
      case 'role':
        return 'This is a valid company role-related email address (not a personal one).';
      case 'catchAll':
        return 'This domain accepts all emails, even if the specific address doesn\'t exist.';
      case 'disposable':
        return 'This is a temporary email address that may not be monitored long-term.';
      case 'inboxFull':
        return 'The inbox of this user is full and can no longer receive new emails.';
      case 'invalid':
        return 'This email address is not available or registered. Emails will bounce back.';
      case 'disabled':
        return 'This account was valid before but has been disabled by the provider.';
      case 'spamtrap':
        return 'This is an email address specifically created to catch spammers.';
      default:
        return 'We couldn\'t verify the status of this address.';
    }
  };

  const getStatusIcon = () => {
    if (!status) return null;
    
    switch (status) {
      case 'safe':
      case 'role':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'catchAll':
        return <CheckCircle className="h-8 w-8 text-blue-500" />;
      case 'disposable':
      case 'inboxFull':
        return <AlertCircle className="h-8 w-8 text-amber-500" />;
      case 'invalid':
      case 'disabled':
      case 'spamtrap':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-xl font-medium text-gray-700 mb-6">
          Enter email address that you want to verify
        </h1>
        
        <div className="flex gap-4 mb-8">
          <div className="flex-grow">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email*"
            />
          </div>
          <button
            onClick={checkEmail}
            disabled={isChecking}
            className="px-8 py-4 bg-red-400 hover:bg-red-500 text-white font-medium rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isChecking ? 'Verifying...' : 'Verify'}
          </button>
        </div>
        
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
        
        {status && (
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1">
                {getStatusIcon()}
              </div>
              <div>
                <p className="text-gray-700">
                  {getStatusDescription()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getReasonColor()}`}>
                    {getReasonText()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-700 font-medium mb-3">Domain</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Name</span>
                    </div>
                    <span className="text-gray-800 text-sm">{domain}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Accept all</span>
                    </div>
                    <span className="text-gray-800 text-sm">{status === 'catchAll' ? 'yes' : 'no'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Disposable</span>
                    </div>
                    <span className="text-gray-800 text-sm">{status === 'disposable' ? 'yes' : 'no'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Free</span>
                    </div>
                    <span className="text-gray-800 text-sm">
                      {['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain) ? 'yes' : 'no'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-700 font-medium mb-3">Account</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Role</span>
                    </div>
                    <span className="text-gray-800 text-sm">{status === 'role' ? 'yes' : 'no'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Disabled</span>
                    </div>
                    <span className="text-gray-800 text-sm">{status === 'disabled' ? 'yes' : 'no'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600 text-sm">Full mailbox</span>
                    </div>
                    <span className="text-gray-800 text-sm">{status === 'inboxFull' ? 'yes' : 'no'}</span>
                  </div>
                </div>
              </div>
              
              {domain && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-700 font-medium mb-3">Provider</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-600 text-sm">Domain</span>
                      </div>
                      <span className="text-gray-800 text-sm">
                        {domain.includes('gmail') ? 'google.com' : 
                         domain.includes('yahoo') ? 'yahoo.com' :
                         domain.includes('hotmail') || domain.includes('outlook') ? 'microsoft.com' :
                         domain}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;