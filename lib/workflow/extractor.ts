    
import { openrouter } from "../openrouter";

export async function extractClaimData(content:string) {

 const completion =
 await openrouter.chat.completions.create({
   model:"openrouter/free",
   messages:[
    {
      role:"system",
      content:`
Return ONLY JSON.

{

"documents":[
{
"filename":"",
"documentType":"",
"confidence":0.99
}
],

"patientName":null,

"hospitalName":null,

"doctorName":null,

"diagnosis":null,

"treatmentDate":null,

"claimedAmount":null,

"confidence":0.95,

"warnings":[]
}
`
    },
    {
      role:"user",
      content
    }
   ]
 });

 return completion.choices[0].message.content;
}