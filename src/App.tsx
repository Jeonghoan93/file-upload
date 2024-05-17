import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false)

  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState<boolean>(false);


  const onClickDialogOpen = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  const predictImage = async (image: File) => {
    // replace this to actual API call
    console.log(image);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      // add snackbar err message
      console.log(error);
    } 
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
     setIsImageUploaded(true)

    if (selectedImage) {
      // delete this setTimeout and call predictImage function
      setTimeout(async () => {
        await predictImage(selectedImage);
        setIsImageUploaded(false);
        onClickDialogOpen();


        setSnackbarMessage("Image uploaded successfully!");
        setIsSnackbarVisible(true);

        setTimeout(() => {
          setIsSnackbarVisible(false);
        }, 2000); 
      }, 3000); 
    } else {
      setIsImageUploaded(false)
      alert("Please select an image first.");
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  
  return (
    <div className="flex flex-col gap-3 items-center">
         <div>
      <span className='text-[30px] font-bold'>
        Face Image Classification
      </span>

    </div>

    <div 
    onClick={onClickDialogOpen}
    className='cursor-pointer border-[2px] rounded-lg p-2 hover:border-red-400 hover:text-red-400 hover:font-semibold'>
        Click here to upload image
    </div>

    {isDialogOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg popup flex flex-col items-center">

            <div 
            onClick={handleUploadClick}
            className="w-64 h-64 border-2 cursor-pointer border-dashed rounded-lg flex items-center justify-center mb-4">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                
                <span className=" font-bold text-xl mb-4 text-blue-700">Upload Your Image</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <div className="flex gap-3 mt-4 self-end">
              <button
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700"
                onClick={onClickDialogOpen}
              >
                Close
              </button>
              
              <button
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
                onClick={handleSubmit}
              >
              {isImageUploaded ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

{isSnackbarVisible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {snackbarMessage}
        </div>
      )}
    </div>
  )
}

export default App
