// Email verification utilities

// 1. Basic Email Syntax Check
export const isValidEmailSyntax = (email: string): boolean => {
  if (!email || !email.trim()) return false;
  
  // More comprehensive regex for email validation
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

// 2. Extract domain from email
export const getDomainFromEmail = (email: string): string => {
  return email.split('@')[1].toLowerCase();
};

// 3. DNS MX Record Validation
export const checkMxRecords = async (domain: string): Promise<boolean> => {
  try {
    // In a browser environment, we can't directly use Node.js DNS module
    // We'll use a mock implementation for demonstration
    // In a real server-side implementation, you would use:
    // const records = await dns.promises.resolveMx(domain);
    
    // For demo purposes, we'll simulate MX record checks
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
      'zoho.com', 'yandex.com', 'gmx.com', 'example.com'
    ];
    
    // Simulate a delay for the DNS lookup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Common domains will return true, others will have a 70% chance of returning true
    if (commonDomains.includes(domain)) {
      return true;
    }
    
    // Random result for other domains (70% chance of having MX records)
    return Math.random() < 0.7;
  } catch (error) {
    console.error('Error checking MX records:', error);
    return false;
  }
};

// 4. SMTP Handshake & Mailbox Verification (Simulated)
export const verifyMailbox = async (email: string): Promise<boolean> => {
  try {
    // In a browser environment, we can't directly establish SMTP connections
    // This would normally be done server-side
    // For demo purposes, we'll simulate SMTP verification
    
    // Simulate a delay for the SMTP connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate some common patterns for invalid emails
    const localPart = email.split('@')[0].toLowerCase();
    
    // Common patterns for non-existent emails
    const invalidPatterns = [
      'test', 'example', 'user', 'info', 'admin', 'webmaster',
      'support', 'noreply', 'no-reply', 'invalid'
    ];
    
    // If the local part contains invalid patterns, 80% chance it's invalid
    if (invalidPatterns.some(pattern => localPart.includes(pattern))) {
      return Math.random() < 0.2;
    }
    
    // Random result for other emails (85% chance of being valid)
    return Math.random() < 0.85;
  } catch (error) {
    console.error('Error verifying mailbox:', error);
    return false;
  }
};

// 5. Catch-All Detection (Simulated)
export const detectCatchAll = async (domain: string): Promise<boolean> => {
  try {
    // In a real implementation, you would try to verify a random, likely non-existent email
    // If it's accepted, the domain probably has a catch-all configuration
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Domains with higher likelihood of being catch-all
    const likelyCatchAllDomains = [
      'company.com', 'business.com', 'enterprise.com', 'startup.com',
      'agency.com', 'firm.com', 'corp.com', 'inc.com', 'catchall.com'
    ];
    
    // If it's in our list of likely catch-all domains, 70% chance it's catch-all
    if (likelyCatchAllDomains.includes(domain)) {
      return Math.random() < 0.7;
    }
    
    // Random result for other domains (20% chance of being catch-all)
    return Math.random() < 0.2;
  } catch (error) {
    console.error('Error detecting catch-all:', error);
    return false;
  }
};

// Combined verification function
export type VerificationStatus = 
  | 'safe' 
  | 'role' 
  | 'catchAll' 
  | 'disposable' 
  | 'invalid' 
  | 'inboxFull' 
  | 'disabled' 
  | 'spamtrap'
  | 'unknown'
  | null;

export const verifyEmail = async (email: string): Promise<VerificationStatus> => {
  // Step 1: Check if email is empty
  if (!email || !email.trim()) {
    return null;
  }
  
  // Step 2: Check email syntax
  if (!isValidEmailSyntax(email)) {
    return 'invalid';
  }
  
  // Extract domain
  const domain = getDomainFromEmail(email);
  
  // Step 3: Check MX records
  const hasMxRecords = await checkMxRecords(domain);
  if (!hasMxRecords) {
    return 'invalid';
  }
  
  // Step 4: Check if it's a role-based email
  const localPart = email.split('@')[0].toLowerCase();
  const roleBasedPatterns = [
    'info', 'admin', 'support', 'contact', 'help', 'sales',
    'billing', 'office', 'mail', 'webmaster', 'hostmaster',
    'postmaster', 'team', 'marketing', 'hello', 'service'
  ];
  
  if (roleBasedPatterns.some(pattern => localPart === pattern || localPart.startsWith(pattern + '.'))) {
    return 'role';
  }
  
  // Step 5: Check if domain has catch-all configuration
  const isCatchAll = await detectCatchAll(domain);
  if (isCatchAll) {
    return 'catchAll';
  }
  
  // Step 6: Verify mailbox existence
  const mailboxExists = await verifyMailbox(email);
  if (!mailboxExists) {
    // Randomly assign one of the failure statuses
    const failureStatuses: VerificationStatus[] = ['invalid', 'inboxFull', 'disabled'];
    return failureStatuses[Math.floor(Math.random() * failureStatuses.length)];
  }
  
  // If all checks pass, the email is considered safe
  return 'safe';
};