# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang
MAINTAINER Aditya Mukerjee <dev@chimeracoder.net>


RUN apt-get update
RUN apt-get install -y wget npm node \
    && apt-get autoremove

RUN mkdir -p /go/src/github.com/ChimeraCoder/go-react-jetpack
WORKDIR /go/src/github.com/ChimeraCoder/go-react-jetpack


RUN npm install -g typescript-compiler
RUN npm install -g webpack
RUN npm install --save-dev babel-loader
RUN npm install es6-promise flux object-assign react
RUN npm install --save-dev babelify




# Copy the local package files to the container's workspace.
ADD . /go/src/github.com/ChimeraCoder/go-react-jetpack

# Build the go-react-jetpack command inside the container.
RUN go get .
RUN go install github.com/ChimeraCoder/go-react-jetpack

# build the Javascript files
#RUN make

EXPOSE 8080

# Run the go-react-jetpack command by default when the container starts.
CMD ["/go/bin/go-react-jetpack"]

