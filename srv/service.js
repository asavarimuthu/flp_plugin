const cds = require("@sap/cds");
const xenv = require("@sap/xsenv");
const axios = require("axios");
const btoa = require("btoa");
const qs = require("qs");
const FormData = require("form-data");
const { executeHttpRequest } = require('@sap-cloud-sdk/core');
var XMLHttpRequest = require('xhr2');



class accountService extends cds.ApplicationService {
  /** Registering custom event handlers */
async init(){
    this.on('getAccountDetails',async (req)=>{
        return "Hello";
   
       } )
   
       return super.init();
}

  async init() {

    this.on('getAccountDetails',async (req)=>{
     return await this.getAcccountDetails();

    } )

    return super.init();
  }


  async getAcccountDetails(){

    //Get the token for Service manager class
    let serviceManager = xenv.getServices({
        "db":{
            "label":"service-manager"}
    });
    let { clientid, clientsecret, url } =
    serviceManager &&
    serviceManager.db;
    let token_srvmgr=await this.getBearerToken(clientid, clientsecret,url);


   let cloudDetails=await this.getCloudMgmtSrvDetails(token_srvmgr);

   let token_cms=await this.getBearerToken(cloudDetails.credentials.uaa.clientid, cloudDetails.credentials.uaa.clientsecret,cloudDetails.credentials.uaa.url);

    let url1="https://accounts-service.cfapps.eu10.hana.ondemand.com"

    //let subAccId="f13218f3-7ff0-41ca-bde2-023c51b5f227";
  
   return await axios.get(url1+"/accounts/v1/subaccounts/"+ cloudDetails.subaccount_id+"?derivedAuthorizations=any", {
    "withCredentials": false,
        headers: { 
         "Authorization": `Bearer ${token_cms}`,
        "Accept": "application/json",
        "DataServiceVersion":"2.0",
        'X-Requested-With': 'XMLHttpRequest',
       }
    }) 
        .then(async (response) => {
           return response.data.displayName;
        })
        .catch((err) => {
            throw new Error(err);
        });
        
  }

  async getCloudMgmtSrvDetails(token){
    
    let srvMgrmUrl="https://service-manager.cfapps.us10.hana.ondemand.com/v1/service_bindings";
    return await axios.get(srvMgrmUrl, {
        "withCredentials": false,
            headers: { 
             "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "DataServiceVersion":"2.0",
            'X-Requested-With': 'XMLHttpRequest',
           }
        }) 
            .then(async (response) => {
                if(response.data.items.length>0){
                    for(var i=0;i<response.data.items.length;i++){
                        if(response.data.items[i].context.instance_name==="cloudMgmtServOther"){
                            return response.data.items[i];
                            
                        }
                    }
                }
              // return response.data.displayName;
            })
            .catch((err) => {
                throw new Error(err);
            });

  }

  async getBearerToken(clientid, clientsecret,url){

    try {
       
         const basicAuth = btoa(`${clientid}:${clientsecret}`);
         const headers = {
             authorization: `Basic ${basicAuth}`,
             "Content-Type": "application/x-www-form-urlencoded",
         };
         return await axios
             .post(
                 url + "/oauth/token?grant_type=client_credentials",  
                 qs.stringify({ grant_type: "client_credentials" }),
                 {
                     headers: headers,
                 }
             )
             .then((response) => {
                 return response.data.access_token;
             })
             .catch((error) => {
                 throw new Error(error);
             });
     } catch (err) {
         throw new Error("Some Error has occured. The cause is" + err);
     } 
   } 
 
}
module.exports = { accountService };