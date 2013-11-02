var srcDir = file("src")
var classesDir = file("classes")
var distDir = file("dist")

function echoHello() {
  Ant.echo(:message = "Hello World")
}

function compile() {
  Ant.mkdir(:dir = classesDir)
  Ant.javac(:srcdir = path(srcDir),
            :destdir = classesDir,
            :includeantruntime = false)
}

@Depends("compile")
function jar() {
  Ant.mkdir(:dir = distDir)
  Ant.jar(:destfile = distDir.file("myproject.jar"),
          :basedir = classesDir)
}

@Depends("compile")
function run() {
  Ant.java(:classname = "myproject.HelloWorld",
           :classpath = path(classesDir),
           :fork = true)
}

function clean() {
  Ant.delete(:dir = classesDir)
  Ant.delete(:dir = distDir)
}