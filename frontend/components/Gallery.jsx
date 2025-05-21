"use client";


export default function Gallery({ gallery }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
  
    if (!gallery || gallery.length === 0)
      return <p className="text-gray-500 text-center">No images available</p>;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Image */}
        <div>
          <img
            src={gallery[0]}
            alt="Main"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
  
        {/* Thumbnails */}
        <div className="grid grid-cols-2 gap-2">
          {gallery.slice(1, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Photo ${i + 1}`}
              className="h-48 w-full object-cover rounded-lg"
            />
          ))}
  
          {gallery.length > 4 && (
            <div className="relative">
              <img
                src={gallery[4]}
                alt="More"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={handleOpenModal}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold rounded-lg"
              >
                +{gallery.length - 4} More Photos
              </button>
            </div>
          )}
        </div>
  
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-2 gap-4">
                {gallery.slice(5).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Extra ${i}`}
                    className="h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
              <button
                onClick={handleCloseModal}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  