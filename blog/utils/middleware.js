

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(`!!!!!!!!!!!!!!!${JSON.stringify(error)}`)
  if (error.errors && error.errors[0].type === "notNull Violation") {
    return response.status(400).json({ error: error.errors[0].message })
  } else if (error.name === "SequelizeDatabaseError" || error.name === "TypeError") {
    return response.status(400).json({ error: "Entity parameters query failed. Query is of wrong format" });
  }  else if (error.type === "entity.parse.failed") {
    return response.status(400).json({ error: "Entity parameters change failed. Query field missing" })

  } else if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: error.errors[0].message })

  }
  else {
    console.log(error.message)
    res.status(500).json({ error: 'Something went wrong. Please try again!' });
}
}


module.exports = {
  errorHandler,
    unknownEndpoint
};