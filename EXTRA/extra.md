share



"
---

  <!-- Section 1: Hero / Cards -->
  <section class="section cards-section">
    <h2 class="section-title">Business Enquiries</h2>
    <div class="cards">
      <div class="card">
        <a href="https://picsum.photos/id/1015/800/600" target="_blank" rel="noopener noreferrer">
          <img src="https://picsum.photos/id/1015/800/600" alt="Mountain landscape" />
          <div class="card-title">Art Inquiry</div>
          <p class="card-desc">Rocky shoreline with blue water and a wide sky.</p>
        </a>
      </div>
      <div class="card">
        <a href="https://picsum.photos/id/1022/800/600" target="_blank" rel="noopener noreferrer">
          <img src="https://picsum.photos/id/1022/800/600" alt="Aurora borealis" />
          <div class="card-title">Event Appearance</div>
          <p class="card-desc">A vivid display of the aurora borealis.</p>
        </a>
      </div>
      <div class="card">
        <a href="https://picsum.photos/id/1035/800/600" target="_blank" rel="noopener noreferrer">
          <img src="https://picsum.photos/id/1035/800/600" alt="Person walking in nature" />
          <div class="card-title">Brand Collaboration</div>
          <p class="card-desc">Explore the beauty of nature through peaceful trails.</p>
        </a>
      </div>
    </div>
  </section>
Heading for section:- Business Enquiries

[ Brand Collaboration ]
[ Event Appearance ]
[ Art Inquiry ]


// GSAP Card Hover Animations <+ implement mobile tap to animate, pause and then tap to select>
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { flex: 3, duration: 0.5, ease: "power2.out" });
    gsap.to(card.querySelector("img"), { scale: 1.2, filter: "grayscale(0%)", duration: 0.5 });
    gsap.to(card.querySelector(".card-desc"), { y: 0, duration: 0.5, ease: "power2.out" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { flex: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(card.querySelector("img"), { scale: 1, filter: "grayscale(100%)", duration: 0.5 });
    gsap.to(card.querySelector(".card-desc"), { y: "100%", duration: 0.5, ease: "power2.out" });
  });
});


---

/* Cards */
.cards {
  display: flex;
  gap: 1rem;
  overflow: hidden;
}

.card {
  flex: 1;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: grayscale(100%);
  transition: all 0.5s ease;
}

.card-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.card-desc {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  background: rgba(0,0,0,0.7);
  transform: translateY(100%);
}

/* MOBILE */
@media (max-width:768px){

  .cards{
    flex-direction: column;
    height: 80vh;
  }

  .card{
    height: 100%;
  }

}

"

Form
↓
Send via WhatsApp


Required fields
validation checks before sending to wa.me

when change the type "[ Brand Collaboration ] [ Event Appearance ] [ Art Inquiry ]" the form is only for "Art inquiry" and thus when select "event appearance" then the form still shows canvas size and shipping and other "Art inquiry" form flow. Each flow should have localstorage persistant memory separate
sendToWhatsApp() {

const name = document.getElementById("name").value;
const company = document.getElementById("company").value;
const phone = document.getElementById("phone").value;
const email = document.getElementById("email").value;

const type = document.getElementById("inquiryType").value;
const date = document.getElementById("date").value;
const location = document.getElementById("location").value;
const budget = document.getElementById("budget").value;
const details = document.getElementById("details").value;

const message = `
*Business Inquiry*

--- Client ---
Name: ${name}
Company: ${company}
Phone: ${phone}
Email: ${email}

--- Request ---
Type: ${type}
Date: ${date}
Location: ${location}

Budget: ${budget}

Details:
${details}
`;

const encoded = encodeURIComponent(message);

window.open(
`https://wa.me/919999999999?text=${encoded}`,
"_blank"
);

}

[ Event Appearance ] 

Budget Filtering (TO avoid low-budget spam inquiries.)
Add dropdown:

₹50k – ₹1L
₹1L – ₹3L
₹3L – ₹10L
₹10L+
Discuss






button to add when in the form section
// Back to Top Button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  gsap.to(window, { scrollTo: 0, duration: 0.7, ease: "power2.out" });
});


---
The text area needs to be a block style and fixed height currently it is very crammed inside the 3 layouts of [ Brand Collaboration ] [ Event Appearance ] [ Art Inquiry ]
<textarea id="eventDetails" placeholder="Event details"></textarea>
have like 100px like space decent so that people do add text in the textareas instead of ignoring them (these aren't required fields but helpful nonetheless)


---
const whatsappNumber = "979945510"