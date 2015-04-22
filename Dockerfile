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

RUN npm install -g typescript \
        && npm install -g webpack \
        && npm install --save-dev babel-loader \
        && npm install es6-promise flux object-assign react \
        && npm install --save-dev babelify \
        && npm install -g tsd \
        && npm install typed-react --save \
        && tsd query react --action install \
        && npm install jsx-typescript \
        && npm install typescript-loader \
        && tsd query jquery --action install

# Copy the local package files to the container's workspace.
ADD . /go/src/github.com/ChimeraCoder/go-react-jetpack



RUN cp typings/react -r typescript \
        && cp node_modules/typed-react -r typescript \
        && cp typings/jquery -r typescript

# build the Javascript files
RUN make

# Build the go-react-jetpack command inside the container.
RUN go get .


EXPOSE 8080

# Run the go-react-jetpack command by default when the container starts.
CMD ["/go/bin/go-react-jetpack"]

