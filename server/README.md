Server side:

1. run: npm run dev
2. API calls:
  - GET http://localhost:4000/api/track --> return all available videos
    exp: ["EOCC","HRCC"]
  - GET http://localhost:4000/api/track/:id --> return a vtt file corresponding to the chose video, id is a file name

  - GET http://localhost:4000/api/track/updateStatus --> request update status of the generating file

  - POST http://localhost:4000/api/track/save --> save changes to the file

  - POST http://localhost:4000/api/track/create --> Create a vtt file from a video 
  
