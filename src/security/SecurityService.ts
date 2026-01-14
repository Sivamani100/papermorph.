// Security Service for PaperMorph 6.0
// Comprehensive security management and monitoring

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'mfa_enabled' | 'mfa_disabled' | 'suspicious_activity' | 'data_access' | 'permission_change';
  userId: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  success?: boolean;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  settings: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    mfaRequired: boolean;
    ipWhitelist: string[];
    ipBlacklist: string[];
  };
}

export interface SecurityAudit {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  success: boolean;
  details: Record<string, any>;
}

class SecurityService {
  private static instance: SecurityService;
  private events: SecurityEvent[] = [];
  private policies: SecurityPolicy[] = [];
  private auditLogs: SecurityAudit[] = [];
  private isInitialized: boolean = false;

  private constructor() {
    this.initializePolicies();
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private initializePolicies(): void {
    this.policies = [
      {
        id: 'default',
        name: 'Default Security Policy',
        description: 'Standard security settings for all users',
        enabled: true,
        settings: {
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireLowercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecialChars: true,
          sessionTimeout: 3600000, // 1 hour
          maxLoginAttempts: 5,
          lockoutDuration: 900000, // 15 minutes
          mfaRequired: false,
          ipWhitelist: [],
          ipBlacklist: []
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise Security Policy',
        description: 'Enhanced security for enterprise users',
        enabled: true,
        settings: {
          passwordMinLength: 12,
          passwordRequireUppercase: true,
          passwordRequireLowercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecialChars: true,
          sessionTimeout: 1800000, // 30 minutes
          maxLoginAttempts: 3,
          lockoutDuration: 1800000, // 30 minutes
          mfaRequired: true,
          ipWhitelist: [],
          ipBlacklist: []
        }
      }
    ];
    this.isInitialized = true;
  }

  // Event Management
  async logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): Promise<SecurityEvent> {
    const securityEvent: SecurityEvent = {
      id: `sec_${Date.now()}`,
      timestamp: new Date(),
      resolved: false,
      ...event
    };

    this.events.push(securityEvent);
    await this.processEvent(securityEvent);
    return securityEvent;
  }

  private async processEvent(event: SecurityEvent): Promise<void> {
    // Process security events based on type and severity
    switch (event.type) {
      case 'suspicious_activity':
        await this.handleSuspiciousActivity(event);
        break;
      case 'login':
        await this.handleLoginEvent(event);
        break;
      case 'password_change':
        await this.handlePasswordChange(event);
        break;
      default:
        console.log('Security event logged:', event);
    }
  }

  private async handleSuspiciousActivity(event: SecurityEvent): Promise<void> {
    // Implement suspicious activity handling
    console.warn('Suspicious activity detected:', event);
  }

  private async handleLoginEvent(event: SecurityEvent): Promise<void> {
    // Implement login event handling
    console.log('Login event:', event);
  }

  private async handlePasswordChange(event: SecurityEvent): Promise<void> {
    // Implement password change handling
    console.log('Password change event:', event);
  }

  // Policy Management
  getPolicies(): SecurityPolicy[] {
    return this.policies.filter(policy => policy.enabled);
  }

  getPolicy(id: string): SecurityPolicy | undefined {
    return this.policies.find(policy => policy.id === id);
  }

  updatePolicy(id: string, updates: Partial<SecurityPolicy>): SecurityPolicy | null {
    const policyIndex = this.policies.findIndex(policy => policy.id === id);
    if (policyIndex !== -1) {
      this.policies[policyIndex] = { ...this.policies[policyIndex], ...updates };
      return this.policies[policyIndex];
    }
    return null;
  }

  // Audit Management
  async logAudit(audit: Omit<SecurityAudit, 'id' | 'timestamp'>): Promise<SecurityAudit> {
    const securityAudit: SecurityAudit = {
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      ...audit
    };

    this.auditLogs.push(securityAudit);
    return securityAudit;
  }

  getAuditLogs(userId?: string, limit: number = 100): SecurityAudit[] {
    let logs = this.auditLogs;
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  // Security Validation
  validatePassword(password: string, policyId: string = 'default'): { isValid: boolean; errors: string[] } {
    const policy = this.getPolicy(policyId);
    if (!policy) {
      return { isValid: false, errors: ['Security policy not found'] };
    }

    const errors: string[] = [];
    const settings = policy.settings;

    if (password.length < settings.passwordMinLength) {
      errors.push(`Password must be at least ${settings.passwordMinLength} characters long`);
    }

    if (settings.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (settings.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (settings.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (settings.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // IP Security
  isIPAllowed(ip: string, policyId: string = 'default'): boolean {
    const policy = this.getPolicy(policyId);
    if (!policy) return true;

    const { ipWhitelist, ipBlacklist } = policy.settings;

    // Check blacklist first
    if (ipBlacklist.length > 0 && ipBlacklist.includes(ip)) {
      return false;
    }

    // If whitelist is configured, only allow whitelisted IPs
    if (ipWhitelist.length > 0) {
      return ipWhitelist.includes(ip);
    }

    return true;
  }

  // Session Management
  isSessionValid(sessionStart: Date, policyId: string = 'default'): boolean {
    const policy = this.getPolicy(policyId);
    if (!policy) return true;

    const now = new Date();
    const sessionAge = now.getTime() - sessionStart.getTime();
    return sessionAge < policy.settings.sessionTimeout;
  }

  // Rate Limiting
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();

  isRateLimited(ip: string, policyId: string = 'default'): boolean {
    const policy = this.getPolicy(policyId);
    if (!policy) return false;

    const attempts = this.loginAttempts.get(ip);
    if (!attempts) return false;

    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - attempts.lastAttempt.getTime();

    // Reset if lockout duration has passed
    if (timeSinceLastAttempt > policy.settings.lockoutDuration) {
      this.loginAttempts.delete(ip);
      return false;
    }

    return attempts.count >= policy.settings.maxLoginAttempts;
  }

  recordLoginAttempt(ip: string, success: boolean, policyId: string = 'default'): void {
    const policy = this.getPolicy(policyId);
    if (!policy) return;

    const attempts = this.loginAttempts.get(ip);
    
    if (success) {
      // Reset on successful login
      this.loginAttempts.delete(ip);
    } else {
      // Increment failed attempts
      if (attempts) {
        attempts.count++;
        attempts.lastAttempt = new Date();
      } else {
        this.loginAttempts.set(ip, {
          count: 1,
          lastAttempt: new Date()
        });
      }
    }
  }

  // Security Analytics
  getSecurityMetrics(): {
    totalEvents: number;
    criticalEvents: number;
    unresolvedEvents: number;
    auditLogs: number;
    failedLogins: number;
    suspiciousActivities: number;
  } {
    return {
      totalEvents: this.events.length,
      criticalEvents: this.events.filter(e => e.severity === 'critical').length,
      unresolvedEvents: this.events.filter(e => !e.resolved).length,
      auditLogs: this.auditLogs.length,
      failedLogins: this.events.filter(e => e.type === 'login' && !e.success).length,
      suspiciousActivities: this.events.filter(e => e.type === 'suspicious_activity').length
    };
  }

  // MFA Management
  async enableMFA(userId: string): Promise<boolean> {
    try {
      await this.logEvent({
        type: 'mfa_enabled',
        userId,
        ip: 'system',
        userAgent: 'system',
        details: {},
        severity: 'medium'
      });
      return true;
    } catch (error) {
      console.error('Failed to enable MFA:', error);
      return false;
    }
  }

  async disableMFA(userId: string): Promise<boolean> {
    try {
      await this.logEvent({
        type: 'mfa_disabled',
        userId,
        ip: 'system',
        userAgent: 'system',
        details: {},
        severity: 'medium'
      });
      return true;
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      return false;
    }
  }

  // Data Encryption
  encryptSensitiveData(data: string): string {
    // In a real implementation, use proper encryption
    return btoa(data);
  }

  decryptSensitiveData(encryptedData: string): string {
    // In a real implementation, use proper decryption
    return atob(encryptedData);
  }

  // Security Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    metrics: ReturnType<typeof this.getSecurityMetrics>;
  }> {
    const metrics = this.getSecurityMetrics();
    const issues: string[] = [];

    if (metrics.criticalEvents > 0) {
      issues.push(`${metrics.criticalEvents} critical security events`);
    }

    if (metrics.unresolvedEvents > 10) {
      issues.push(`${metrics.unresolvedEvents} unresolved security events`);
    }

    if (metrics.suspiciousActivities > 5) {
      issues.push(`${metrics.suspiciousActivities} suspicious activities detected`);
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      status = issues.length > 2 ? 'critical' : 'warning';
    }

    return {
      status,
      issues,
      metrics
    };
  }

  // Cleanup and Maintenance
  async cleanup(): Promise<void> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Clean up old events
    this.events = this.events.filter(event => event.timestamp > thirtyDaysAgo);
    
    // Clean up old audit logs
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > thirtyDaysAgo);
    
    // Clean up old login attempts
    for (const [ip, attempts] of this.loginAttempts.entries()) {
      if (now.getTime() - attempts.lastAttempt.getTime() > 24 * 60 * 60 * 1000) {
        this.loginAttempts.delete(ip);
      }
    }
  }
}

export default SecurityService;
