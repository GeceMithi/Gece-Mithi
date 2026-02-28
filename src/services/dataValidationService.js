// Data Validation Service for Firebase Firestore
// This service validates data before saving to ensure data integrity

import { validationRules, monitoringConfig } from '../firebaseConfig';

class DataValidationService {
  constructor() {
    this.rules = validationRules;
    this.monitoring = monitoringConfig;
  }

  // Validate data before saving
  validateData(collectionName, data) {
    const rules = this.rules[collectionName];
    
    if (!rules) {
      console.warn(`⚠️ No validation rules found for collection: ${collectionName}`);
      return { isValid: true, errors: [] };
    }

    const errors = [];
    
    // Check required fields
    for (const field of rules.required) {
      if (!data[field] || data[field] === '') {
        errors.push(`${field} is required`);
      }
    }

    // Validate field constraints (only for fields that have values)
    for (const [field, constraints] of Object.entries(rules.constraints)) {
      const value = data[field];
      
      // Skip validation if field is optional and empty/undefined
      if (rules.optional.includes(field) && (!value || value === '')) {
        continue;
      }
      
      if (value !== undefined && value !== null && value !== '') {
        // Check length constraints
        if (constraints.maxLength && value.length > constraints.maxLength) {
          errors.push(`${field} exceeds maximum length of ${constraints.maxLength}`);
        }
        
        if (constraints.minLength && value.length < constraints.minLength) {
          errors.push(`${field} must be at least ${constraints.minLength} characters long`);
        }

        // Check pattern constraints (can be added later)
        if (constraints.pattern && !constraints.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    }

    // Check for unexpected fields
    const allowedFields = [...rules.required, ...rules.optional];
    const unexpectedFields = Object.keys(data).filter(field => !allowedFields.includes(field));
    
    if (unexpectedFields.length > 0) {
      console.warn(`⚠️ Unexpected fields in ${collectionName}: ${unexpectedFields.join(', ')}`);
    }

    const isValid = errors.length === 0;
    
    if (!isValid) {
      console.error(`❌ Validation failed for ${collectionName}:`, errors);
      this.sendAlert('Data Validation Failed', `Collection: ${collectionName}, Errors: ${errors.join(', ')}`);
    }

    return {
      isValid,
      errors,
      warnings: unexpectedFields.length > 0 ? unexpectedFields : []
    };
  }

  // Sanitize data to prevent XSS and injection attacks
  sanitizeData(data) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Basic XSS prevention
        sanitized[key] = value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  // Validate document size
  validateDocumentSize(data) {
    const maxSize = this.monitoring.alerts.maxDocumentSize;
    const dataSize = JSON.stringify(data).length;
    
    if (dataSize > maxSize) {
      const error = `Document size (${dataSize} bytes) exceeds maximum allowed size (${maxSize} bytes)`;
      console.error('❌ Document size validation failed:', error);
      this.sendAlert('Document Size Limit Exceeded', error);
      return false;
    }
    
    return true;
  }

  // Check collection size limits
  async checkCollectionSize(collectionName, currentCount) {
    const maxDocuments = this.monitoring.alerts.maxDocuments[collectionName];
    
    if (maxDocuments && currentCount >= maxDocuments) {
      const warning = `Collection ${collectionName} has reached maximum document limit (${maxDocuments})`;
      console.warn('⚠️ Collection size limit reached:', warning);
      this.sendAlert('Collection Size Limit Reached', warning);
      return false;
    }
    
    return true;
  }

  // Validate email format (for admin email)
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate URL format
  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate date format
  validateDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // Validate boolean fields
  validateBoolean(value) {
    return typeof value === 'boolean';
  }

  // Custom validation for specific collections
  validateFacultyData(data) {
    const baseValidation = this.validateData('faculty', data);
    
    // Additional faculty-specific validations
    const errors = [...baseValidation.errors];
    
    // Validate duration format (should contain years)
    if (data.duration && !/\d{4}/.test(data.duration)) {
      errors.push('Duration should include year information');
    }
    
    // Validate isActive field if present
    if (data.isActive !== undefined && !this.validateBoolean(data.isActive)) {
      errors.push('isActive must be a boolean value');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: baseValidation.warnings
    };
  }

  validateVolunteerTeacherData(data) {
    const baseValidation = this.validateData('volunteer_teachers', data);
    
    // Additional volunteer teacher specific validations
    const errors = [...baseValidation.errors];
    
    // Validate batch format (should start with "Batch" or "2k")
    if (data.batch && !/^(Batch|2k)/.test(data.batch)) {
      errors.push('Batch should start with "Batch" or "2k"');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: baseValidation.warnings
    };
  }

  validateOutlineData(data) {
    const baseValidation = this.validateData('outlines', data);
    
    // Additional outline specific validations
    const errors = [...baseValidation.errors];
    
    // Validate fileUrl if present
    if (data.fileUrl && !this.validateUrl(data.fileUrl)) {
      errors.push('fileUrl must be a valid URL');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: baseValidation.warnings
    };
  }

  validateNotesData(data) {
    const baseValidation = this.validateData('notes', data);
    
    // Additional notes specific validations
    const errors = [...baseValidation.errors];
    
    // Validate fileUrl if present
    if (data.fileUrl && !this.validateUrl(data.fileUrl)) {
      errors.push('fileUrl must be a valid URL');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: baseValidation.warnings
    };
  }

  validatePastPaperData(data) {
    const baseValidation = this.validateData('past_papers', data);
    
    // Additional past paper specific validations
    const errors = [...baseValidation.errors];
    
    // Validate year format
    if (data.year && !/^\d{4}$/.test(data.year)) {
      errors.push('Year must be a 4-digit number');
    }
    
    // Validate fileUrl if present
    if (data.fileUrl && !this.validateUrl(data.fileUrl)) {
      errors.push('fileUrl must be a valid URL');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: baseValidation.warnings
    };
  }

  validateToolsData(data) {
    const baseValidation = this.validateData('tools', data);
    
    // Additional tools specific validations
    const errors = [...baseValidation.errors];
    
    // Validate url
    if (data.url && !this.validateUrl(data.url)) {
      errors.push('url must be a valid URL');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: baseValidation.warnings
    };
  }

  // Send alert for validation failures
  sendAlert(title, message) {
    if (!this.monitoring.enabled) return;
    
    console.log(`🚨 VALIDATION ALERT: ${title} - ${message}`);
    
    // Store alert for monitoring
    const alertData = {
      title,
      message,
      timestamp: new Date().toISOString(),
      severity: 'medium',
      type: 'validation'
    };
    
    // In a real implementation, you would send this to your monitoring service
    console.log('Alert data:', alertData);
  }

  // Get validation summary
  getValidationSummary() {
    return {
      rulesCount: Object.keys(this.rules).length,
      monitoringEnabled: this.monitoring.enabled,
      maxDocumentSize: this.monitoring.alerts.maxDocumentSize,
      collectionLimits: this.monitoring.alerts.maxDocuments
    };
  }
}

// Create and export singleton instance
const validationService = new DataValidationService();
export default validationService;
