/* ── SUPABASE CONNECTION ── */
console.log("✅ Janice Site JS loaded");
var SUPABASE_URL="https://sutapxqrjwvxoelemkyf.supabase.co";
var SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dGFweHFyand2eG9lbGVta3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODIxODQsImV4cCI6MjA5MDA1ODE4NH0.I08GWewsc9kNcg102-5nDCWPDU1f3o11kEHMgCe9J-c";

/* ── FIX: Prevent browser autopopulate across forms ── */
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll("input").forEach(function(inp){
    inp.setAttribute("autocomplete","off");
    inp.setAttribute("autocomplete","new-password");
  });
  document.querySelectorAll("form").forEach(function(f){
    f.setAttribute("autocomplete","off");
  });
});

/* ── SMART SAVE: Merge leads with same email ── */
async function saveLead(data){
  var sourceLabels={buyer_guide:"Buyer's Guide",seller_guide:"Seller's Guide",home_worth:"Home Value Request",buyer_readiness:"Buyer Readiness Tool",consultation:"Book Consultation",contact_form:"Contact Form"};
  var sourceLabel = sourceLabels[data.source] || data.source;
  var timestamp = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"});

  if(data.email){
    try{
      var checkRes = await fetch(SUPABASE_URL+"/rest/v1/website_leads?email=eq."+encodeURIComponent(data.email)+"&order=created_at.desc&limit=1",{
        headers:{"apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY}
      });
      if(checkRes.ok){
        var existing = await checkRes.json();
        if(existing.length > 0){
          var lead = existing[0];
          var newNote = sourceLabel + " (" + timestamp + ")";
          var updatedNotes = lead.notes ? lead.notes + " | " + newNote : newNote;
          var updatedSource = lead.source;
          if(lead.source !== data.source){ updatedSource = data.source; }
          var patchData = { notes: updatedNotes, source: updatedSource };
          if(data.phone && !lead.phone) patchData.phone = data.phone;
          if(data.address && !lead.address) patchData.address = data.address;
          if(data.name && !lead.name) patchData.name = data.name;
          await fetch(SUPABASE_URL+"/rest/v1/website_leads?id=eq."+lead.id,{
            method:"PATCH",
            headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY},
            body:JSON.stringify(patchData)
          });
          console.log("Lead MERGED:",data.source,data.email);
          sendEdgeFunctionEmail(data);
          return;
        }
      }
    }catch(e){console.log("Merge check error:",e);}
  }

  try{
    var noteText = sourceLabel + " (" + timestamp + ")";
    var postData = {
      name: data.name || "", email: data.email || "", phone: data.phone || "",
      source: data.source || "other", address: data.address || "",
      notes: data.notes ? data.notes + " | " + noteText : noteText, status: "new"
    };
    var res = await fetch(SUPABASE_URL+"/rest/v1/website_leads",{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY,"Prefer":"return=minimal"},
      body:JSON.stringify(postData)
    });
    if(!res.ok) console.error("Supabase error:",res.status);
    else console.log("Lead CREATED:",data.source,data.name);
  }catch(e){console.error("Save failed:",e);}
  sendEdgeFunctionEmail(data);
}

function sendEdgeFunctionEmail(data){
  fetch(SUPABASE_URL+"/functions/v1/send-lead-email",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+SUPABASE_KEY},
    body:JSON.stringify(data)
  }).then(function(res){
    if(res.ok) console.log("Emails sent for:",data.name);
    else console.error("Email error:",res.status);
  }).catch(function(e){console.error("Email failed:",e);});
}

function getVal(id){var e=document.getElementById(id);return e?e.value.trim():"";}
function clearForm(ids){ids.forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});}

/* Modals */
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.modal-overlay').forEach(function(o){o.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open')})});

/* Booking */
var bookingType="Buyer Consultation";
function selectBookingType(el,type){bookingType=type;document.querySelectorAll('.booking-type-btn').forEach(function(b){b.classList.remove('active')});el.classList.add('active');document.getElementById('selectedType').textContent='📋 '+type}
function handleBooking(){
  var name=getVal("bk_name"),phone=getVal("bk_phone"),email=getVal("bk_email"),date=getVal("bk_date"),notes=getVal("bk_notes");
  if(!name){alert("Please enter your name.");return;}
  saveLead({name:name,phone:phone,email:email,source:"consultation",consultation_type:bookingType,preferred_date:date,notes:notes});
  document.getElementById('booking-success').style.display='block';
  clearForm(["bk_name","bk_phone","bk_email","bk_date","bk_notes"]);
}

/* Lead Magnets */
function handleLeadMagnet(type){
  console.log("handleLeadMagnet called with:",type);
  var name="",email="",phone="",address="";
  if(type==="buyer"){name=getVal("bg_name");email=getVal("bg_email");clearForm(["bg_name","bg_email"]);}
  else if(type==="seller"){name=getVal("sg_name");email=getVal("sg_email");clearForm(["sg_name","sg_email"]);}
  else if(type==="homeworth"){name=getVal("hw_name");phone=getVal("hw_phone");email=getVal("hw_email");address=getVal("hw_address");clearForm(["hw_name","hw_phone","hw_email","hw_address"]);}
  if(!name&&!email){alert("Please enter at least your name or email.");return;}
  var sourceMap={buyer:"buyer_guide",seller:"seller_guide",homeworth:"home_worth"};
  saveLead({name:name,email:email,phone:phone,source:sourceMap[type]||"other",address:address});
  var icons={buyer:'📋',seller:'🏠',homeworth:'📊'};
  var titles={buyer:"Buyer's Guide on Its Way!",seller:"Seller's Guide on Its Way!",homeworth:"Home Value Report Requested!"};
  var bodies={buyer:"Thank you"+(name?", "+name:"")+"! Your free Buyer's Guide will be in your inbox shortly. Janice will personally follow up within 24 hours to see how she can help with your home search.",seller:"Thank you"+(name?", "+name:"")+"! Your free Seller's Guide will be in your inbox shortly. Janice will reach out personally to discuss your home's value and selling strategy.",homeworth:"Thank you"+(name?", "+name:"")+"! Janice is preparing your personalized home value report"+(address?" for "+address:"")+" and will have it ready within 24 hours."};
  document.getElementById('leadModalIcon').textContent=icons[type]||'📋';
  document.getElementById('leadModalTitle').textContent=titles[type]||'Thank You!';
  document.getElementById('leadModalBody').textContent=bodies[type]||'Janice will be in touch soon!';
  var extra=document.getElementById('leadModalExtra');
  if(type==="homeworth"){extra.innerHTML='<a href="https://homequityreport.com/janicedivina" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:var(--crimson);color:#fff;padding:0.7rem 1.5rem;border-radius:8px;font-weight:700;font-size:0.88rem;text-decoration:none;margin-top:0.5rem">🏠 Check Your Home Value Now →</a>';}
  else{extra.innerHTML='';}
  openModal('leadModal');
}

/* Blog */
var blogPosts=[
  {bg:'linear-gradient(135deg,#2D0F17,#8B1C2A)',icon:'🏡',tag:"Buyer's Guide",title:"5 Things Bay Area Families Need to Know Before Moving to San Joaquin",content:'<p>Making the move from the Bay Area to San Joaquin County is one of the best decisions for your family.</p><p><strong>1. Plan your commute carefully.</strong> Tracy and Manteca offer the best access to the ACE train.</p><p><strong>2. Your dollar goes significantly further.</strong> A Bay Area condo budget buys a 4-bedroom home here.</p><p><strong>3. Community is everything.</strong> San Joaquin has thriving Filipino, Vietnamese, and Latino communities.</p><p><strong>4. Do your homework on schools.</strong> Quality varies by neighborhood — I can guide you.</p><p><strong>5. Move fast.</strong> Come pre-approved and ready to make decisions.</p>'},
  {bg:'linear-gradient(135deg,#1A2D0F,#2A4A1A)',icon:'📊',tag:"Market Update",title:"San Joaquin County Real Estate Market: What You Need to Know in 2026",content:'<p>The San Joaquin County market continues to show resilience and opportunity in 2026.</p><p><strong>For Sellers:</strong> Inventory remains tight. Homes priced correctly see strong interest within two weeks.</p><p><strong>For Buyers:</strong> Interest rates have stabilized. Pre-approval is your first essential step.</p><p><strong>Key Markets:</strong> Manteca, Tracy, and Lodi continue to attract the most Bay Area transplants.</p>'},
  {bg:'linear-gradient(135deg,#2D1A0F,#4A2A1A)',icon:'🌺',tag:"Community",title:"How Filipino Families Are Finding Their Dream Homes in Manteca & Tracy",content:'<p>Filipino families are building generational wealth through homeownership in San Joaquin County.</p><p>Families are building <em>homes</em>. Homes where lola can have her garden, where grandchildren can run in the backyard.</p><p>San Joaquin offers space, affordability, and a growing Filipino community that feels like <em>pamilya</em>.</p><p>If your family is considering the move — <em>kausapin mo ako</em>. I understand your values completely.</p>'}
];
function openBlog(i){var p=blogPosts[i];document.getElementById('blogModalImg').style.background=p.bg;document.getElementById('blogModalImg').innerHTML=p.icon;document.getElementById('blogModalBody').innerHTML='<div style="color:var(--crimson);font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:0.5rem;">'+p.tag+'</div><h2>'+p.title+'</h2>'+p.content+'<a href="#booking" class="btn-crimson" onclick="closeModal(\'blogModal\')" style="margin-top:1.5rem;display:inline-block;font-size:0.88rem;">Let\'s Talk →</a>';openModal('blogModal')}

/* Smooth scroll for nav */
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var target=document.querySelector(this.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}})});
