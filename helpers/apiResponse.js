exports.successResponse = (res, message, data=null) => {
  let response = {
    message: message,
  }
  if (data){
    response['data'] = data;
  }
  return res.status(200).json(response)
}

exports.jsonResponse = (res, data, status=200) => res.status(status).json(data);

exports.invalidResponse = (res, message) => res.status(403).json({message: message})
exports.notFoundResponse = (res, message) => res.status(404).json({message: message})
exports.errorResponse = (res, message) => res.status(500).json({message: message})
