// import React, { useState } from 'react';

// const PaymentPage: React.FC<{ onPaymentSuccess?: () => void }> = ({ onPaymentSuccess }) => {
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [name, setName] = useState('');
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');

//   const handlePayment = (e: React.FormEvent) => {
//     e.preventDefault();
//     setProcessing(true);
//     setError('');
//     // Simulate payment processing
//     setTimeout(() => {
//       setProcessing(false);
//       if (cardNumber && expiry && cvv && name) {
//         if (onPaymentSuccess) onPaymentSuccess();
//         alert('Payment Successful!');
//       } else {
//         setError('Please fill all fields correctly.');
//       }
//     }, 1500);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
//         <form onSubmit={handlePayment} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Cardholder Name"
//             className="w-full px-4 py-2 border rounded"
//             value={name}
//             onChange={e => setName(e.target.value)}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Card Number"
//             className="w-full px-4 py-2 border rounded"
//             value={cardNumber}
//             onChange={e => setCardNumber(e.target.value)}
//             maxLength={16}
//             required
//           />
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="MM/YY"
//               className="w-1/2 px-4 py-2 border rounded"
//               value={expiry}
//               onChange={e => setExpiry(e.target.value)}
//               maxLength={5}
//               required
//             />
//             <input
//               type="password"
//               placeholder="CVV"
//               className="w-1/2 px-4 py-2 border rounded"
//               value={cvv}
//               onChange={e => setCvv(e.target.value)}
//               maxLength={4}
//               required
//             />
//           </div>
//           {error && <div className="text-red-500 text-sm">{error}</div>}
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
//             disabled={processing}
//           >
//             {processing ? 'Processing...' : 'Pay Now'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
import React, { useState } from "react";
import { motion } from "framer-motion";

const PaymentPage: React.FC<{ onPaymentSuccess?: () => void }> = ({
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // ✅ Simple validators
  const validateCardNumber = (num: string) =>
    /^\d{16}$/.test(num.replace(/\s+/g, ""));
  const validateExpiry = (exp: string) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
    const [mm, yy] = exp.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return yy > currentYear || (yy === currentYear && mm >= currentMonth);
  };
  const validateCVV = (num: string) => /^\d{3,4}$/.test(num);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    setTimeout(() => {
      setProcessing(false);
      if (
        name &&
        validateCardNumber(cardNumber) &&
        validateExpiry(expiry) &&
        validateCVV(cvv)
      ) {
        if (onPaymentSuccess) onPaymentSuccess();
        alert("✅ Payment Successful!");
      } else {
        setError("Please enter valid card details.");
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-500">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
          💳 Secure Payment
        </h2>

        <form onSubmit={handlePayment} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              placeholder=" "
              className="peer w-full px-4 pt-5 pb-2 border-2 rounded-xl focus:outline-none transition
                border-gray-200 focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600">
              Cardholder Name
            </label>
          </div>

          {/* Card Number */}
          <div className="relative">
            <input
              type="text"
              placeholder=" "
              className={`peer w-full px-4 pt-5 pb-2 border-2 rounded-xl focus:outline-none transition 
                ${cardNumber && !validateCardNumber(cardNumber) ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-green-400"}`}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={16}
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600">
              Card Number
            </label>
          </div>

          {/* Expiry + CVV */}
          <div className="flex space-x-3">
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder=" "
                className={`peer w-full px-4 pt-5 pb-2 border-2 rounded-xl focus:outline-none transition 
                  ${expiry && !validateExpiry(expiry) ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-green-400"}`}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
                required
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600">
                Expiry (MM/YY)
              </label>
            </div>
            <div className="relative w-1/2">
              <input
                type="password"
                placeholder=" "
                className={`peer w-full px-4 pt-5 pb-2 border-2 rounded-xl focus:outline-none transition 
                  ${cvv && !validateCVV(cvv) ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-green-400"}`}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
                required
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600">
                CVV
              </label>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Pay Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 hover:from-green-600 hover:via-teal-600 hover:to-blue-700 shadow-lg transition relative overflow-hidden"
            disabled={processing}
          >
            <span className="relative z-10">
              {processing ? "Processing..." : "Pay Securely"}
            </span>
            <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
