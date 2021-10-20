import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

//apex classes
import getChildrenAccounts from "@salesforce/apex/GetRecordService.getAccountChildren";
import getAccountAssets from "@salesforce/apex/GetRecordService.getAccountAssets";


const COLUMNS = [
	{ fieldName: "AccountName", label: "Account Name" },
	{ fieldName: "Assets", label: "# of Assets" },

];


export default class AccountHierarchy extends LightningElement{
gridColumns = COLUMNS;
gridData = [];

@api recordId; // grabs the current record




// update the number of assets for the current Account
currentRow = {};


currentRow.AccountName =  recordId;
currentRow.Assets = getAssets(recordId);
currentRow._children = [];


gridData = currentRow;









// get all children accounts using the currrent recordID
@wire(getChildrenAccounts, { parentId: '$recordId'})
.then( (result) =>
{
if (result && result.length > 0) {

	//set up children so that they are accessible and have asset counts
const children = result.map((child) => ({
							_children: [],
							AccountName : child.Name
						}));
this.gridData = getChildrenData(recordId, children, this.gridData);


}else{
  this.dispatchEvent(
						new ShowToastEvent({
							title: "No Children for this Account",
							message: error + " " + error?.message,
							variant: "warning"
						})
					);
}

})
.catch((error) => {
	this.dispatchEvent(
		new ShowToastEvent({
			title: "Error with displaying account hierarchy",
			message: error + " " + error?.message,
			variant: "warning"
		})
	);

}).finally (()=>{

})



// reserved to reuse for children assets. I may need to call this more than once
getAssets(recordId){

  @wire(getAccountAssets, {recordId: '$recordId'})
.then( (result) => {
   return result;
}).catch ((error)=>{
	this.dispatchEvent(
		new ShowToastEvent({
			title: "Error Loading Account Assets",
			message: error + " " + error?.message,
			variant: "error"
		})
	);
})

}



// gets the number of assets for each child
getChildrenData(recordId, children, gridData){

let tempchildren = children.map( (child) =>{
	@wire(getAccountAssets, {recordId: '$recordId'})
	.then ((result) => {
		child.Assets = result;
	}).catch ((error) => {
		this.dispatchEvent(
			new ShowToastEvent({
				title: "Error Loading Account Assets",
				message: error + " " + error?.message,
				variant: "error"
			})
		)
	});
	


});


chidren = tempchildren

return gridData.map( (row)=>{

if(row.Name === recordId){
  row._children = children;
}else{
  this.getChildrenData(recordId, children, row._children);
}


});






}

}