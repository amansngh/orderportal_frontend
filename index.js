const server='http://localhost:7019';
var currentTab=1;

$("#formsubmit").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    $.ajax({
        url: (server+"/order/submit"),
        type: 'POST',
        data: formData,
        success: function (data) {
            if(currentTab==1)
            Get();
            else if (currentTab==2)
            getOnly("stringart")
            else if(currentTab==3)
            getOnly("portrait")
           // this.form.reset();
        },
        cache: false,
        contentType: false,
        processData: false
    });
});

$("#formupdate").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    $.ajax({
        url: (server+"/order/update"),
        type: 'POST',
        data: formData,
        success: function (data) {
            alert("Values Updated");
            document.getElementById("closemodal").click();
            if(currentTab=="1")
            Get();
            else if(currentTab=="2")
            getOnly("stringart")
            else if(currentTab=="3")
            getOnly("portrait")
        },
        cache: false,
        contentType: false,
        processData: false
    });
});

/* $("textarea").keyup(function(e){
    if((e.keyCode || e.which) == 13) {
        console.log(document.getElementById("row-1-specification").value);
        document.getElementById("row-1-specification").value+= "\n"
    }
}); */

$(document).ready(function(){
    $("#searchinput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tbody2 tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

function Delete(arg)
{
  //console.log(IDs[arg]);
    var val=confirm("Surely , Delete this record??");
  if (val==true)
  {
    axios.delete((server+"/order/delete"), { data: { _id: IDs[arg] } })
    .then((response)=>{
       // console.log(response);
       if(currentTab===1)
        Get();
      else if(currentTab===2)
      getOnly("stringart");
      else if(currentTab===3)
      getOnly("portrait");

     })
     .catch((error)=>{
         console.log(error);
     })
  }

}

function getDataForUpdate(arg)
{
    var oid=IDs[arg];
    axios.get((server+'/getdataforupdate'), {
    params: {
      oid,
    }
  })
  .then(function (response) {
    console.log(response.data);
    const{_id,advancepaid,placedby,telephone,costprice,image_id,sellingprice,shippingdate,specification,status,type}=response.data;
    
    document.getElementById("row-2-id").value=_id;
    document.getElementById("row-2-placedby").value=placedby;
    document.getElementById("row-2-telephone").value=telephone;

    if(type==="String Art")
    document.getElementById("row-2-stringart").setAttribute("selected","true");
    else
    document.getElementById("row-2-portrait").setAttribute("selected","true");

    document.getElementById("row-2-image").src="../backend/uploads/"+image_id;
    if(status==="Placed")
    document.getElementById("row-2-placed").setAttribute("selected","true");
    else if(status==="Shipped")
    document.getElementById("row-2-shipped").setAttribute("selected","true")
    else
    document.getElementById("row-2-reached").setAttribute("selected","true");
    
    document.getElementById("row-2-specification").value=specification;
    document.getElementById("row-2-sellingprice").value=sellingprice
    document.getElementById("row-2-advancepaid").value=advancepaid
    document.getElementById("row-2-costprice").value=costprice
    document.getElementById("row-2-shippingdate").value=shippingdate
  })
  .catch(function (error) {
    console.log(error);
  });

}

let IDs =[]; let pointer,p1,p2,p3;
let arrayStatus=[["",`selected="selected"`,""],[`class="bg-warning"`,`selected="selected"`,""],[`class="bg-success"`,`selected="selected"`,""]]
  
function Get(){
    currentTab=1;
    loading("started");
    document.getElementById("slider").checked=true;
    IDs=[];
   axios.get((server+'/employee/order'))
  .then(function (response) {
    loading("completed");
    document.getElementById("tbody2").innerHTML="";
    response.data.sort(function(a,b){
        return new Date(a.shippingdate) - new Date(b.shippingdate);
      });
     plot(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getOnly(arg){
    loading("started");
    document.getElementById("slider").checked=true;
    IDs=[];
    if(arg==="stringart")
    {
      currentTab=2;
     axios.get((server+'/employee/order/stringart'))
     .then(function (response) {
     loading("completed");
     document.getElementById("tbody2").innerHTML="";
     plot(response);
      })
     .catch(function (error) {
      console.log(error);
     });
    }
    else if(arg==="portrait")
    {
     currentTab=3;
     axios.get((server+'/employee/order/portrait'))
     .then(function (response) {
     loading("completed");
     document.getElementById("tbody2").innerHTML="";
     plot(response);
      })
     .catch(function (error) {
      console.log(error);
     });
    }
}
    


function loading(arg)
{
    if(arg==="started")
    {
    document.getElementById("divloader").style.display="";
    document.getElementById("divtable").style.display="none";
    document.getElementById("tablesummary").style.display="none";
    }
   if(arg==="completed")
   {
    document.getElementById("divloader").style.display="none";  
    document.getElementById("divtable").style.display="";
    document.getElementById("tablesummary").style.display="";
   }
}

function plot(response)
{
    let sp=0,cp=0;
    for(let i=0;i<response.data.length;i++)
    {
        IDs.push(response.data[i]._id);
        sp+=response.data[i].sellingprice
        cp+=response.data[i].costprice
        if(response.data[i].status=="Placed")
        {
            pointer=0;
            p1=1;p2=2;p3=2;
        }
        else if(response.data[i].status=="Shipped")
        {
          pointer=1;
          p1=2;p2=1;p3=2;
        }
        else {
          pointer =2;
          p1=2;p2=2;p3=1;
        }
            document.getElementById("tbody2").innerHTML+=`<tr id="row-`+i+`" `+ arrayStatus[pointer][0] +`>
            <th scope="row" width="50%">`+(i+2)+`</th>
            <td>`+response.data[i].type+`</td>
            <td>`+response.data[i].placedby+`</td>
            <td>`+response.data[i].telephone+`</td>
            <td colspan=2> <image src="../backend/uploads/`+response.data[i].image_id+`" class="I" alt="`+response.data[i].image_id +`" onclick=setSrc("../backend/uploads/`+response.data[i].image_id+`") data-toggle="modal" data-target="#imgModal"> </image> </td>
            <td>`+response.data[i].specification+`</td>
            <td >`+response.data[i].sellingprice+`</td>
            <td >`+response.data[i].costprice+`</td>
            <td >`+response.data[i].advancepaid+`</td>
            <td>`+response.data[i].shippingdate+`</td>
            <td> <select size="1" id="row-3-status" name="row-3-status" onchange="changeState(this.value,`+i+`)">
              <option value="Placed" `+ arrayStatus[pointer][p1] +`>
                  Placed
              </option>
              <option value="Shipped" `+ arrayStatus[pointer][p2] +`>
                  Shipped
              </option>
              <option value="Reached" `+ arrayStatus[pointer][p3] +`>
                  Reached
              </option>
          </select> </td>
          <td> <button style="margin:8px; margin-bottom:0px" id="row-`+(i+1)+`-delete" onclick="Delete(`+i+`)" class="btn btn-danger btn-sm"> Delete </button> 
          <br>
            <button style="margin:8px" id="row-`+(i+1)+`-update" onclick="getDataForUpdate(`+i+`)" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal"> Update </button> 
             </td>
          </tr>`
        
        } 
        if(sp>cp)
        document.getElementById("profit").style.color='lightgreen'
        else
        document.getElementById("profit").style.color='salmon'

        document.getElementById("revenue").innerText="Revenue : "+sp;
        document.getElementById("profit").innerText="Profit : "+(sp-cp)
        document.getElementById("totalorder").innerText="Total Order : "+response.data.length
        document.getElementById("averageorder").innerText="Average Order Price : "+((sp/response.data.length).toFixed(2))
        document.getElementById("row-1-placedby").value=""
        document.getElementById("row-1-photo").value=null;
        document.getElementById("row-1-telephone").value=""
        document.getElementById("row-1-specification").value=""
        document.getElementById("row-1-sellingprice").value=""
        document.getElementById("row-1-costprice").value=""
        document.getElementById("row-1-advancepaid").value=""
        document.getElementById("row-1-shippingdate").value=""     

}
function hideImageInput()
{
    var slider = document.getElementById("slider");
    var img_inp= document.getElementById("row-1-photo");
    if(slider.checked==false)
    {
        img_inp.disabled=true;
    }

    else
    {
        img_inp.disabled=false;
    }
}
function hideImageInput2()
{
    var slider = document.getElementById("slider2");
    var img_inp= document.getElementById("row-2-photo");
    if(slider.checked==false)
    {
       
        img_inp.disabled=true;
    }

    else
    {
        img_inp.disabled=false;
    }
}
function setSrc(arg)
{
    document.getElementById("img01").src=arg;
    document.getElementById("img01").alt="NO IMG";

}
function changeState(arg1,arg2)
{
  if(arg1==="Shipped")
  document.getElementById("row-"+arg2).setAttribute("class","bg-warning")
  else if(arg1==="Reached")
  document.getElementById("row-"+arg2).setAttribute("class","bg-success");
  else
  document.getElementById("row-"+arg2).setAttribute("class","");
  axios.patch((server+"/order/changestatus"), { data: { _id: IDs[arg2], status:arg1 } })
    .then((response)=>{
        console.log(response);
        Get();

     })
     .catch((error)=>{
         console.log(error);
     })
}
Get();
    