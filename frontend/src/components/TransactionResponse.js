import '../TransactionResponse.css';

const TransactionResponse = ({title, message, closeResponseBox}) => {
  
  return (
    <div className="overlay">
      <div className="transactionMessageBox">
          <span className='title'>{title}</span>
          <div className='message'>{message}</div>
          <span className="closeBox" onClick={closeResponseBox}>x</span>
      </div>
    </div>
  );
};
  
export default TransactionResponse;