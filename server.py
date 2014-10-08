import SimpleHTTPServer
import SocketServer

PORT = 8001

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("localhost", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
