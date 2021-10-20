/*


This helps manage information about each Account and its children

*/




public class AccountWrapper{
    
    @AuraEnabled
    public String Name; // id of the account

    @AuraEnabled
    public Integer Assets; //acount of assets
  
    @AuraEnabled
    public List < AccountWrapper > children; // all the children

}