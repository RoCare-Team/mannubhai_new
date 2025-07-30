'use client'; // Mark this as a Client Component
import { useRouter, useSearchParams } from 'next/navigation'; // Updated imports
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaStar } from 'react-icons/fa';

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const review_id = searchParams.get('review_id');
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cmpl_id, setCmplId] = useState('');
  
  useEffect(() => {
    if (review_id) {
      const decoded = decodeString(review_id);
      setCmplId(`CMPL${decoded}`);
    }
  }, [review_id]);

  const decodeString = (encodedString) => {
    if (!encodedString) return '';
    
    try {
      // Replace the URL-safe characters back to base64 standard
      const base64String = encodedString.replace(/-/g, '+').replace(/_/g, '/').replace(/,/g, '=');
      
      // Decode base64 (works in browser environment)
      const allstring = atob(base64String);
      
      const removed_suffix_with_prefix = allstring.substring(0, allstring.indexOf('#'));
      const removed_prefix_decoded_string = removed_suffix_with_prefix.substring(
        removed_suffix_with_prefix.indexOf('~') + '~'.length
      );
      
      return removed_prefix_decoded_string;
    } catch (error) {
      console.error('Decoding error:', error);
      return '';
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      alert('Please Select Star To Rate Us!');
      return;
    }
    
    if (!cmpl_id) {
      alert('CMPL ID missing.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `https://waterpurifierservicecenter.in/wizard/app/review.php?reating=${rating}&cmpl_id=${cmpl_id}&comment=${encodeURIComponent(comment)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        alert("We appreciate your feedback. Thank you!");
        window.location.href = data.status;
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Review</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </Head>
      
      <div className="container">
        <a href="#">
          <img src="logo.png" alt="Logo" />
        </a>
        
        <h3 className="heading">Please give your valuable feedback...</h3>
        
        <div>
          <input 
            name="feedbackMsg" 
            className="cmpl" 
            id="cmpl_id" 
            value={cmpl_id} 
            readOnly 
          />
        </div>
        
        <div className="rating">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i}>
                <input 
                  type="radio" 
                  name="rating" 
                  value={ratingValue} 
                  onClick={() => setRating(ratingValue)}
                  style={{ display: 'none' }}
                />
                <FaStar 
                  className="star" 
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                  size={30}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
        
        <div id="msgBox">
          <textarea 
            name="feedbackMsg" 
            id="feedbackMsg" 
            placeholder="Please write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <button 
            className="feedbackbtn" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        
        .heading {
          margin: 20px 0;
          color: #333;
        }
        
        .cmpl {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .rating {
          margin: 20px 0;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        
        .star {
          cursor: pointer;
          transition: color 0.2s;
        }
        
        #msgBox {
          margin-top: 20px;
        }
        
        #feedbackMsg {
          width: 100%;
          min-height: 100px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
        }
        
        .feedbackbtn {
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .feedbackbtn:hover {
          background-color: #45a049;
        }
        
        .feedbackbtn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}