document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("file-upload");
    const button = document.getElementById("uploadfile");
    const status = document.getElementById("status");

    button.addEventListener("click", () => {

        const file = fileInput.files[0];

        if (!file) {
            status.textContent = "Please select a JPEG image.";
            return;
        }

        if (file.type !== "image/jpeg") {
            status.textContent = "Only JPEG images are supported.";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const imageDataURL = event.target.result;

            try {
                // Extract full EXIF data before removal
                const exifBefore = piexif.load(imageDataURL);

                // Remove ALL EXIF metadata
                const cleanedImage = piexif.remove(imageDataURL);

                // Convert cleaned image to Blob
                const byteString = atob(cleanedImage.split(',')[1]);
                const mimeString = cleanedImage.split(',')[0].split(':')[1].split(';')[0];

                const arrayBuffer = new ArrayBuffer(byteString.length);
                const intArray = new Uint8Array(arrayBuffer);
                for (let i = 0; i < byteString.length; i++) {
                    intArray[i] = byteString.charCodeAt(i);
                }

                const cleanBlob = new Blob([arrayBuffer], { type: mimeString });

                // Auto-download cleaned image
                const downloadUrl = URL.createObjectURL(cleanBlob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = "cleaned_" + file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                //commented out since the users won't really need a log file
 /*               
                //generate a full log of removed EXIF
                const logContent = `
=== EXIF Log for ${file.name} ===

--- Original EXIF Data ---
${JSON.stringify(exifBefore, null, 2)}

--- All EXIF Removed ---
EXIF has been completely stripped of important information.
`;
                //auto-download the log file
                const logBlob = new Blob([logContent], { type: "text/plain" });
                const logUrl = URL.createObjectURL(logBlob);

                const logLink = document.createElement("a");
                logLink.href = logUrl;
                logLink.download = "exif_log_" + file.name + ".txt";
                document.body.appendChild(logLink);
                logLink.click();
                document.body.removeChild(logLink);

                status.textContent = "All EXIF metadata removed and log downloaded.";
*/
            } catch (error) {
                console.error(error);
                status.textContent = "Error processing file.";
            }

        };

        reader.readAsDataURL(file);
    });

});

document.getElementById('gitHubLink').addEventListener('click', function(event){
    event.preventDefault();
    chrome.tabs.create({url:'https://github.com/Femto-0/anakatevo'});
});
