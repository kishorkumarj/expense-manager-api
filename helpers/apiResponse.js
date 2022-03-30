exports.successResponse = (res, message='success', data=null) => {
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
exports.unauthorizedResponse = (res, message="Unauthorized") => res.status(401).json({message: message})
exports.badResponse = (res, message="Bad request") => res.status(400).json({message: message})
exports.notFoundResponse = (res, message="Not found!!") => res.status(404).json({message: message})
exports.errorResponse = (res, message='Internal server error') => res.status(500).json({message: message})
