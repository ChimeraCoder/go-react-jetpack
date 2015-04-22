# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang
MAINTAINER Aditya Mukerjee <dev@chimeracoder.net>


RUN apt-get update
RUN apt-get install -y wget npm nodejs \
    && apt-get autoremove

RUN mkdir -p /go/src/github.com/ChimeraCoder/go-react-jetpack
WORKDIR /go/src/github.com/ChimeraCoder/go-react-jetpack

RUN ln -s /usr/bin/nodejs /usr/bin/node
ENV PATH $PATH:/usr/src/go/bin/:/usr/bin:/bin:/usr/sbin:/sbin

RUN npm install -g typescript
RUN npm install -g webpack
RUN npm install --save-dev babel-loader
RUN npm install es6-promise flux object-assign react
RUN npm install --save-dev babelify
RUN npm install -g tsd
RUN npm install typed-react --save
RUN tsd query react --action install
RUN npm install jsx-typescript
RUN npm install typescript-loader
RUN tsd query jquery --action install


# Copy the local package files to the container's workspace.
ADD . /go/src/github.com/ChimeraCoder/go-react-jetpack

# Build the go-react-jetpack command inside the container.
RUN go get .
RUN go install github.com/ChimeraCoder/go-react-jetpack


RUN cp typings/react -r typescript
RUN cp node_modules/typed-react -r typescript
RUN cp typings/jquery -r typescript

# build the Javascript files
RUN make

EXPOSE 8080

# Run the go-react-jetpack command by default when the container starts.
CMD ["/go/bin/go-react-jetpack"]

