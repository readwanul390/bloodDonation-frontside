import emailjs from "emailjs-com";
import { useRef } from "react";

const Contact = () => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_uypnbhm",
        "template_4ash6ok",
        formRef.current,
        "N0CkI0IM58gNxVs24"
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          alert("❌ Failed to send message");
          console.error(error);
        }
      );
  };

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Contact Us
      </h1>

      <div className="bg-white shadow p-6 rounded">
        <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="input input-bordered w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="input input-bordered w-full"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            required
            className="textarea textarea-bordered w-full"
          ></textarea>

          <button type="submit" className="btn btn-error w-full text-white">
            Send Message
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default Contact;
