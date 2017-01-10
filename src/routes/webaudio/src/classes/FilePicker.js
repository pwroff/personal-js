/**
 * Created by Leonid on 28/10/16.
 */

//check if browser supports file api and filereader features
if (window.File && window.FileReader && window.FileList && window.Blob) {

    //this is not completely neccesary, just a nice function I found to make the file size format friendlier
    //http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
    function humanFileSize(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if(bytes < thresh) return bytes + ' B';
        var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(bytes >= thresh);
        return bytes.toFixed(1)+' '+units[u];
    }


    //this function is called when the input loads a video
    function renderAudio(file){
        var reader = new FileReader();
        reader.onload = function(event){
            var retVal = event.target.result;

        }

        //when the file is read it triggers the onload event above.
        reader.readAsDataURL(file);
    }

    document.getElementById('fileInput').onchange = function() {
        //grab the first image in the fileList
        //in this example we are only loading one file.
        console.log(this.files[0].size);
        renderAudio(this.files[0])
    }

} else {

    alert('The File APIs are not fully supported in this browser.');

}
