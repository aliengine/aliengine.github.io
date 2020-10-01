function topMenu() {
    let menu = document.getElementById("menu");

    if (!menu.className) {
        menu.className += "responsive";
        setTimeout(function () {
            document.querySelector('#menu.responsive ul').style.left = -10 + 'px';
        }, 100)
    } else {
        document.querySelector('#menu.responsive ul').style.left = -1000 + 'px';
        setTimeout(function () { menu.className = "" }, 260);
    }
}

window.onload = function() {
    window.onscroll = function () {
        onScroll()
    };

    document.querySelector('#year').textContent = new Date().getFullYear();
}

const links = document.querySelectorAll("#header a");

for (const link of links) {
    link.addEventListener("click", clickHandler);
}

function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
        top: offsetTop - 120,
        behavior: "smooth",
        block: "start"
    });
}

const navbar = document.querySelector("#header-wrapper");
let sticky = navbar.offsetTop + 1;

function onScroll() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

var codes = [];
codes.push(`let colors = d3.scaleOrdinal(d3.schemeCategory10);
    let stepColor = parseInt(360 / bars.length);
    const stroke = {};
    for (let bar in bars) {
        if (bars.length <= 10) { stroke[bars[bar]] = colors(bar) }
        else { stroke[bars[bar]] = "hsl(" + (bar * stepColor) + ", 85%, 35%)" };
    }

    let newDivId = 'div-id-' + cont,
        newDiv = d3.select('[data-bar-chart="' + cont + '"]')
            .append('div')
            .attr('id', newDivId)
            .attr('class', 'containerBarReporting');

    let svg = newDiv,
        margin = { top: 20, right: 0, bottom: 0, left: 40 },
        width = parseInt(document.getElementById(newDivId).clientWidth) + (margin.left + margin.right),
        tmpHeight = bars.length > 14 ? bars.length * 32.5 : 450,
        height = tmpHeight - margin.top - margin.bottom,
        g = svg.append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 " + (width + 100 + (strMaxLen * 9)) + " " + (height + 50))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .on('mousemove', function() {
                d3.select('#bar-tooltip')
                    .style('left', (d3.event.pageX - 25) + 'px')
                    .style('top', (d3.event.pageY - 20) + 'px')
            })
            .on('mouseout', function () {
                d3.select('#bar-tooltip').classed('hidden', true)
            });

    let defs = g.append("defs");
    createGradients(defs);`);

codes.push(`.typewriter-text {
    animation: blink .75s step-end infinite;
    border-right: 3px solid white;
    box-sizing: border-box;
    margin-left: 3px;
    margin-top: -3px;
}

.dev-coder {
    width: 350px;
    position: absolute;
    z-index: 10;
    left: 20px;
}

@keyframes blink {
    from, to {
        border-color: transparent
    }
    50% {
        border-color: white;
    }
}`);

codes.push(`version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
    environment:
      FLASK_ENV: development
  redis:
    image: "redis:alpine"`);

codes.push(`    import io from 'socket.io-client';
    export default {
        data: () => ({
            chat: false,
            user: 'test1234',
            color: 'red',
            message: '',
            messages: [],
            socket : io('localhost:42516', {
                query: { type: 'user' },
            })
        }),

        methods: {
            sendMessage(e) {
                e.preventDefault();

                this.socket.emit('SEND_MESSAGE', {
                    user: this.user,
                    message: this.message
                });
                this.message = ''
            }
        },

        mounted() {
            this.socket.on('MESSAGE', (data) => {
                this.messages = [...this.messages, data];
                let objDiv = document.getElementById("messages");
                objDiv.scrollTop = objDiv.scrollHeight;
            });

            this.socket.on('OPS', (data) => {
                let totalOps = data.length;
                if (!totalOps || totalOps === 0) {
                    this.color = 'red'

                } else if (totalOps === 1) {
                    this.color = 'orange'

                } else {
                    this.color = 'green'
                }
            });

        }
    }`);

codes.push(`    /**
     * Execute the calculation, response with status success and result into data or status error and messages.
     *
     * @Route("/api/calculate", name="api_calculation_calculate", methods={"POST"})
     *
     * @param ProjectsTable  $projectsTable
     * @param ScopesTable    $scopesTable
     * @param RatingTable    $ratingTable
     * @param TemplatesTable $templatesTable
     * @param Request        $request [
     *      results => [
     *          0 => [
     *              scopeId => (int),
     *              ratingId => (int)
     *          ]
     *      ]
     * ]
     *
     *
     * @return JsonResponse array [
     *  status => (string) success|error,
     *  messages => ['message1', 'messageN'],
     *  data = [
     *      result => [
     *          score => [
     *              max => (int)
     *              result => (int)
     *          ],
     *          budgetRange => (string),
     *          budgetTarget => (string),
     *          sizeImage => (string) size image link,
     *          budgetImage => (string) budget image link,
     *          timeImageDsk => (string) time image link
     *          timeImageMobile => (string) time image link
     *      ]
     * ]
     */
    public function calculate(
        Request $request,
        ProjectsTable $projectsTable,
        ScopesTable $scopesTable,
        RatingTable $ratingTable,
        TemplatesTable $templatesTable
    ) : JsonResponse {
//        $user = $this->getAndDecode($request, "userData");
        $results = $this->getAndDecode($request, "userScore");
        $results = $this->parseResults($results);
        $scopes = $scopesTable->getData();
        $ratings = $ratingTable->getData();

        $result = 0;
        foreach ($scopes as $scope) {
            $result += $ratings[$results[$scope['scopeId']]]['value'] * $scope['weighting'];
        }

        $result = ceil($result);
        $result = ($result > 100) ? 100 : $result;
        $left = 100 - $result;

        $project = $projectsTable->getWhereScoreIsTheLargestValueSmallerThan($result);

        $templates = $templatesTable->getData([
            "field" => "templateId",
            "value" => $project["templateId"]
        ]);

        $templates[0]['images']['superior'] = $project['graph'];

        unset($project['projectId']);
        unset($project['templateId']);
        unset($templates[0]['templateId']);

        return $this->successJson([
            'result' => $result,
            'chart' => [$left, $result],
            'project' => $project,
            'template' => $templates[0]
        ]);
    }`);

codes.push(`#
# This role will install Packer. The 'packer_version' variable is available to determine which version to install on the host
#
- block:
    - name: create packer_signatures directory
      file:
        path: /tmp/packer_signatures
        state: directory
    - name: upload HashiCorp GPG key file
      copy:
        content: "{{ hashicorp_gpg_key }}"
        dest: /tmp/packer_signatures/hashicorp.asc
    - name: import HashiCorp GPG key
      shell: >
        gpg --import hashicorp.asc
      args:
        chdir: /tmp/packer_signatures
    - name: get SHA256 signature file for the desired Packer executable (linux_amd64)
      get_url:
        url: "https://releases.hashicorp.com/packer/{{ packer_version }}/packer_{{ packer_version }}_SHA256SUMS.sig"
        dest: /tmp/packer_signatures/SHA256SUMS.sig
    - name: get SHA256 file for the desired Packer executable (linux_amd64)
      get_url:
        url: "https://releases.hashicorp.com/packer/{{ packer_version }}/packer_{{ packer_version }}_SHA256SUMS"
        dest: /tmp/packer_signatures/SHA256SUMS
    - name: verify the signature is untampered
      shell: >
        gpg --verify SHA256SUMS.sig SHA256SUMS
      args:
        chdir: /tmp/packer_signatures
    - name: grep the correct signature from the file
      shell: >
        cat /tmp/packer_signatures/SHA256SUMS |grep linux_amd64 |awk '{print $1}'
      register: checksum
    - debug:
        var: checksum.stdout
    - name: download the desired Packer executable if the checksum matches
      get_url:
        url: "https://releases.hashicorp.com/packer/{{ packer_version }}/packer_{{ packer_version }}_linux_amd64.zip"
        dest: "/tmp/packer_signatures/packer_{{ packer_version }}_linux_amd64.zip"
        checksum: "sha256:{{ checksum.stdout }}"
    - name: verify the SHASUM matches the binary
      shell: >
        shasum -a 256 -c SHA256SUMS > result
      args:
        chdir: /tmp/packer_signatures
      ignore_errors: true
    - name: check shasum result file
      shell: >
        cat result | grep 'packer_{{ packer_version }}_linux_amd64.zip: OK'
      args:
        chdir: /tmp/packer_signatures
    - name: extract the Packer binary and put it in /usr/local/bin
      unarchive:
        src: "/tmp/packer_signatures/packer_{{ packer_version }}_linux_amd64.zip"
        dest: /usr/local/bin
        mode: 0755
        remote_src: yes
  always:
    - name: cleanup directory file
      file:
        path: /tmp/packer_signatures
        state: absent`);

codes.push(`from flask import Flask
from api.db.bike_db import db, populate_db
from api import api
app = Flask(__name__)
api.init_app(app)
uri = "http://www.mocky.io/v2/582c30600f0000490e7a147f"
db.drop_all()
db.create_all()
populate_db(uri)
@app.teardown_request
def session_clear(exception=None):
    db.session.remove()
    if exception and db.session.is_active:
        db.session.rollback()
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=80)`);

var incCode = 0,
    speed = 10,
    code = codes[Math.floor(Math.random() * codes.length)],
    monitor = document.getElementById("type-writer");

function typeWriter() {
    if (!!code) {
        if (incCode < code.length) {
            monitor.innerHTML += code.charAt(incCode);
            incCode++;

            let div = document.querySelector('.typewriter')
            div.scrollTop = div.scrollHeight;

            setTimeout(typeWriter, speed);

        } else {
            incCode = 0;
            code = codes[Math.floor(Math.random() * codes.length)];
            setTimeout(function () {
                monitor.innerHTML = '';
                setTimeout(typeWriter, speed);
            }, 3000)
        }
    }
}

typeWriter();