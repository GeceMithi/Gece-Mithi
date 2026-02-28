// Data Backup Service for Firebase Firestore
// This service handles automatic backups and data retention

import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { backupConfig, retentionPolicy, monitoringConfig } from '../firebaseConfig';

class DataBackupService {
  constructor() {
    this.isBackupEnabled = backupConfig.autoBackup;
    this.backupInterval = null;
    this.lastBackupTime = null;
  }

  // Initialize backup service
  async initialize() {
    if (!this.isBackupEnabled) return;
    
    console.log('🔄 Data Backup Service initialized');
    
    // Set up automatic backup schedule
    this.setupAutoBackup();
    
    // Check for data retention cleanup
    await this.checkDataRetention();
  }

  // Setup automatic backup based on configuration
  setupAutoBackup() {
    const interval = this.getBackupInterval();
    
    if (interval > 0) {
      this.backupInterval = setInterval(async () => {
        await this.performBackup();
      }, interval);
      
      console.log(`📅 Auto backup scheduled: ${backupConfig.backupInterval}`);
    }
  }

  // Get backup interval in milliseconds
  getBackupInterval() {
    switch (backupConfig.backupInterval) {
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7 days
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000; // 30 days
      default:
        return 0; // No automatic backup
    }
  }

  // Perform complete backup of all collections
  async performBackup() {
    try {
      console.log('🔄 Starting backup process...');
      const timestamp = new Date().toISOString();
      const backupData = {};

      // Backup each collection
      for (const collectionName of backupConfig.collections) {
        const collectionData = await this.backupCollection(collectionName);
        backupData[collectionName] = collectionData;
      }

      // Save backup to Firestore (in a separate backups collection)
      const backupId = `backup_${timestamp.replace(/[:.]/g, '-')}`;
      await setDoc(doc(db, 'backups', backupId), {
        timestamp,
        data: backupData,
        version: '1.0',
        collections: backupConfig.collections
      });

      this.lastBackupTime = timestamp;
      console.log(`✅ Backup completed successfully: ${backupId}`);
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Backup failed:', error);
      this.sendAlert('Backup failed', error.message);
    }
  }

  // Backup a single collection
  async backupCollection(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
          backedUpAt: new Date().toISOString()
        });
      });

      console.log(`📦 Backed up ${documents.length} documents from ${collectionName}`);
      return documents;
      
    } catch (error) {
      console.error(`❌ Failed to backup ${collectionName}:`, error);
      throw error;
    }
  }

  // Clean up old backups based on retention policy
  async cleanupOldBackups() {
    try {
      const retentionDays = backupConfig.retentionDays;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      const backupsQuery = query(
        collection(db, 'backups'),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(backupsQuery);
      let deletedCount = 0;
      
      querySnapshot.forEach((doc) => {
        const backupDate = new Date(doc.data().timestamp);
        if (backupDate < cutoffDate) {
          deleteDoc(doc.ref);
          deletedCount++;
        }
      });

      if (deletedCount > 0) {
        console.log(`🗑️ Cleaned up ${deletedCount} old backups`);
      }
      
    } catch (error) {
      console.error('❌ Failed to cleanup old backups:', error);
    }
  }

  // Check and enforce data retention policy
  async checkDataRetention() {
    if (!retentionPolicy.autoDelete) return;
    
    console.log('🔍 Checking data retention policy...');
    
    for (const [collectionName, retentionPeriod] of Object.entries(retentionPolicy.retentionPeriods)) {
      if (retentionPeriod === null) continue; // Skip collections with permanent retention
      
      await this.cleanupOldDocuments(collectionName, retentionPeriod);
    }
  }

  // Clean up old documents in a collection
  async cleanupOldDocuments(collectionName, retentionPeriod) {
    try {
      const cutoffDate = new Date(Date.now() - retentionPeriod);
      const querySnapshot = await getDocs(collection(db, collectionName));
      let deletedCount = 0;
      
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const createdAt = docData[retentionPolicy.ageField];
        
        if (createdAt) {
          const docDate = new Date(createdAt);
          if (docDate < cutoffDate) {
            deleteDoc(doc.ref);
            deletedCount++;
          }
        }
      });

      if (deletedCount > 0) {
        console.log(`🗑️ Cleaned up ${deletedCount} old documents from ${collectionName}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to cleanup ${collectionName}:`, error);
    }
  }

  // Restore data from backup
  async restoreFromBackup(backupId) {
    try {
      console.log(`🔄 Starting restore from backup: ${backupId}`);
      
      const backupDoc = await getDocs(collection(db, 'backups'));
      const backup = backupDoc.docs.find(doc => doc.id === backupId);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      const backupData = backup.data().data;
      let restoredCount = 0;

      // Restore each collection
      for (const [collectionName, documents] of Object.entries(backupData)) {
        for (const document of documents) {
          await setDoc(doc(db, collectionName, document.id), document.data);
          restoredCount++;
        }
      }

      console.log(`✅ Restore completed: ${restoredCount} documents restored`);
      return restoredCount;
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }

  // Get backup history
  async getBackupHistory() {
    try {
      const querySnapshot = await getDocs(collection(db, 'backups'));
      const backups = [];
      
      querySnapshot.forEach((doc) => {
        backups.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
    } catch (error) {
      console.error('❌ Failed to get backup history:', error);
      return [];
    }
  }

  // Send alert for critical events
  sendAlert(title, message) {
    if (!monitoringConfig.enabled) return;
    
    console.log(`🚨 ALERT: ${title} - ${message}`);
    
    // In a real implementation, you would send email, SMS, or push notification
    // For now, we'll just log it and store in Firestore
    const alertData = {
      title,
      message,
      timestamp: new Date().toISOString(),
      severity: 'high'
    };
    
    // Store alert in Firestore for monitoring
    setDoc(doc(db, 'alerts', `alert_${Date.now()}`), alertData);
  }

  // Stop backup service
  stop() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
      console.log('⏹️ Data Backup Service stopped');
    }
  }

  // Get service status
  getStatus() {
    return {
      enabled: this.isBackupEnabled,
      lastBackup: this.lastBackupTime,
      nextBackup: this.backupInterval ? new Date(Date.now() + this.getBackupInterval()) : null,
      interval: backupConfig.backupInterval,
      retentionDays: backupConfig.retentionDays
    };
  }
}

// Create and export singleton instance
const backupService = new DataBackupService();
export default backupService;
