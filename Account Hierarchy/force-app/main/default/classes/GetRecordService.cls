public with sharing class GetRecordService {
  
   
    // returns the number of assets for a given account
    @AuraEnabled
     public static Integer getAccountAssets(Id recordId) {
        return [SELECT Count() FROM Asset where AccountId = :recordId];
    }

    // returns the children belonging to a given account
    @AuraEnabled
     public static List<Account> getAccountChildren(Id parentID) {
        return [SELECT Id, Name FROM Account where ParentId = :parentID];
    }
    
}
