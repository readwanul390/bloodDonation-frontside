const Contact = () => {
  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Contact Us
      </h1>

      <div className="bg-white shadow p-6 rounded">
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
          <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
          <textarea placeholder="Your Message" className="textarea textarea-bordered w-full"></textarea>
          <button className="btn btn-error w-full text-white">Send Message</button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          📞 Phone: 01777-123456 <br />
          📧 Email: support@bloodcare.com
        </p>
      </div>
    </div>
  );
};

export default Contact;
