import { processClaim } from "./lib/workflow/engine";

async function run() {

const result =
 await processClaim({

  memberId:"EMP001",

  category:"dental",

  claimedAmount:12000,

  procedures:[
    {
      name:"Root Canal Treatment",
      amount:8000
    },
    {
      name:"Teeth Whitening",
      amount:4000
    }
  ],

  documents:[
    {
      type:"HOSPITAL_BILL",
      readable:true,
      patientName:"Rajesh Kumar"
    }
  ]
});

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );
}

run();